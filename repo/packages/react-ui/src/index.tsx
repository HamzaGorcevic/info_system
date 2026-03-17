import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { KanbanBoard } from './KanbanBoard';

class MalfunctionKanbanWebComponent extends HTMLElement {
    mountPoint!: HTMLDivElement;
    root!: Root;

    static get observedAttributes() {
        return ['malfunctions-json'];
    }

    connectedCallback() {
        if (!this.mountPoint) {
            this.mountPoint = document.createElement('div');
            // Append without Shadow DOM so it inherits CSS (Tailwind classes) from Angular parent
            this.appendChild(this.mountPoint);
            this.root = createRoot(this.mountPoint);
        }
        this.renderReact();
    }

    attributeChangedCallback(_name: string, oldValue: string, newValue: string) {
        if (this.root && oldValue !== newValue) {
            this.renderReact();
        }
    }

    disconnectedCallback() {
        if (this.root) {
            setTimeout(() => this.root.unmount(), 0);
        }
    }

    renderReact() {
        const rawData = this.getAttribute('malfunctions-json');
        let malfunctions = [];
        if (rawData) {
            try {
                malfunctions = JSON.parse(rawData);
            } catch (e) {
                console.error('Failed to parse malfunctions JSON in WebComponent:', e);
            }
        }

        this.root.render(
            <KanbanBoard
                malfunctions={malfunctions}
                onStatusChange={(id, status) => {
                    this.dispatchEvent(new CustomEvent('mySecretReactEvent', { detail: { id, status } }));
                }}
                onAssignClick={(malfunction) => {
                    this.dispatchEvent(new CustomEvent('assignClick', { detail: malfunction }));
                }}
            />
        );
    }
}

if (!customElements.get('my-awesome-kanban')) {
    customElements.define('my-awesome-kanban', MalfunctionKanbanWebComponent);
}

export { MalfunctionKanbanWebComponent };
