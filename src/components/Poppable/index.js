import Context from './Poppable.context';
import Poppable from './Poppable.stateful';
import ManualPoppable from './Poppable';
// import AdjustablePoppable from './components/Adjustable';

Poppable.Context = Context;
Poppable.Manual = ManualPoppable;
// Poppable.Adjustable = AdjustablePoppable;

export default Poppable;
