import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { Settings, Wrench, CheckCircle, Clock } from 'lucide-react';

export interface Malfunction {
    id: string;
    title: string;
    description: string;
    category: string;
    status: 'reported' | 'assigned' | 'in_progress' | 'resolved';
    created_at: string;
    image_url?: string;
    servicer_id?: string;
}

export interface KanbanBoardProps {
    malfunctions: Malfunction[];
    onStatusChange: (malfunctionId: string, newStatus: string) => void;
    onAssignClick: (malfunction: Malfunction) => void;
}

const COLUMN_COLORS = {
    reported: 'bg-blue-50/50 border-blue-100',
    assigned: 'bg-amber-50/50 border-amber-100',
    in_progress: 'bg-indigo-50/50 border-indigo-100',
    resolved: 'bg-emerald-50/50 border-emerald-100'
};

const ICONS = {
    reported: <Clock className="w-5 h-5 text-blue-500" />,
    assigned: <Wrench className="w-5 h-5 text-amber-500" />,
    in_progress: <Settings className="w-5 h-5 text-indigo-500 animate-spin-slow" />,
    resolved: <CheckCircle className="w-5 h-5 text-emerald-500" />
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ malfunctions, onStatusChange, onAssignClick }) => {
    const [columns, setColumns] = useState<Record<string, Malfunction[]>>({
        reported: [],
        assigned: [],
        in_progress: [],
        resolved: []
    });

    useEffect(() => {
        // Group malfunctions by status
        const grouped = malfunctions.reduce((acc, curr) => {
            const status = curr.status || 'reported';
            if (!acc[status]) acc[status] = [];
            acc[status].push(curr);
            return acc;
        }, { reported: [], assigned: [], in_progress: [], resolved: [] } as Record<string, Malfunction[]>);

        setColumns(grouped);
    }, [malfunctions]);

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        const sourceStatus = source.droppableId;
        const destStatus = destination.droppableId;

        const sourceCol = [...(columns[sourceStatus] || [])];
        const destCol = [...(columns[destStatus] || [])];

        const [moved] = sourceCol.splice(source.index, 1);

        // Assign new status locally for immediate UI update
        moved.status = destStatus as Malfunction['status'];

        if (sourceStatus === destStatus) {
            sourceCol.splice(destination.index, 0, moved);
            setColumns(prev => ({ ...prev, [sourceStatus]: sourceCol }));
        } else {
            destCol.splice(destination.index, 0, moved);
            setColumns(prev => ({
                ...prev,
                [sourceStatus]: sourceCol,
                [destStatus]: destCol
            }));
            // Notify Angular parent
            onStatusChange(moved.id, destStatus);
        }
    };

    const COLUMNS = [
        { id: 'reported', label: 'Reported' },
        { id: 'assigned', label: 'Assigned' },
        { id: 'in_progress', label: 'In Progress' },
        { id: 'resolved', label: 'Resolved' }
    ];

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 overflow-x-auto pb-4 items-start w-full">
                {COLUMNS.map(col => (
                    <div key={col.id} className="flex-1 min-w-[320px] max-w-[400px]">
                        <div className="flex items-center gap-3 mb-4 px-2">
                            {ICONS[col.id as keyof typeof ICONS]}
                            <h2 className="font-black text-[#1B3C53] uppercase tracking-wider">{col.label}</h2>
                            <span className="ml-auto bg-white shadow-sm px-2 py-1 rounded-lg text-xs font-bold text-[#456882]">
                                {columns[col.id]?.length || 0}
                            </span>
                        </div>

                        <Droppable droppableId={col.id}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`min-h-[200px] p-4 rounded-3xl border-2 transition-colors ${COLUMN_COLORS[col.id as keyof typeof COLUMN_COLORS]} ${snapshot.isDraggingOver ? 'ring-4 ring-[#1B3C53]/10' : ''}`}
                                >
                                    {columns[col.id]?.map((item, index) => (
                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`bg-white rounded-2xl p-5 mb-4 border border-gray-100 transition-all ${snapshot.isDragging ? 'shadow-2xl scale-[1.02] rotate-2' : 'shadow-sm hover:shadow-md'
                                                        }`}
                                                >
                                                    {item.image_url && (
                                                        <div className="w-full h-32 rounded-xl overflow-hidden bg-gray-100 mb-4 hover:opacity-90 transition-opacity">
                                                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover pointer-events-none" />
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#456882] px-2 py-1 bg-gray-100 rounded-md">
                                                            {item.category}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-gray-400">
                                                            {new Date(item.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>

                                                    <h4 className="font-bold text-[#1B3C53] mb-2 leading-tight">{item.title}</h4>
                                                    <p className="text-xs text-[#456882] line-clamp-2 mb-4">
                                                        {item.description}
                                                    </p>

                                                    {(col.id === 'reported' || col.id === 'assigned') && (
                                                        <button
                                                            onClick={(e) => {
                                                                // Prevent dragging when clicking button
                                                                e.stopPropagation();
                                                                onAssignClick(item);
                                                            }}
                                                            className="w-full py-2 bg-[#1B3C53]/5 hover:bg-[#1B3C53]/10 text-[#1B3C53] font-bold text-[10px] tracking-widest uppercase rounded-xl transition-colors"
                                                        >
                                                            Assign Servicer
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                    {columns[col.id]?.length === 0 && (
                                        <div className="h-24 flex items-center justify-center border-2 border-dashed border-[#456882]/20 rounded-2xl">
                                            <span className="text-[#456882] text-xs font-bold uppercase tracking-wider">Empty</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </div>
        </DragDropContext>
    );
};

export default KanbanBoard;
