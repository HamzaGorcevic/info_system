import { IContext } from './context.interface';

declare global {
    namespace Express {
        interface Request {
            context: IContext;
        }
    }
}
