import Scrollable from './Scrollable';
import Context from './Scrollable.context';
import {VerticalScrollbar, HorizontalScrollbar, VerticalScrollbarPlaceholder, HorizontalScrollbarPlaceholder, Shadow}  from './components';

Scrollable.VerticalScrollbar = VerticalScrollbarPlaceholder;
Scrollable.VerticalScrollbar.Default = VerticalScrollbar;
Scrollable.HorizontalScrollbar = HorizontalScrollbarPlaceholder;
Scrollable.HorizontalScrollbar.Default = HorizontalScrollbar;
Scrollable.Context = Context;
Scrollable.Shadow = Shadow;

export default Scrollable;
