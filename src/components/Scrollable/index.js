import Scrollable from './Scrollable';
import {VerticalScrollbar, HorizontalScrollbar, VerticalScrollbarPlaceholder, HorizontalScrollbarPlaceholder, Shadow}  from './components';
import {getThumbLength, getThumbPosition} from './Scrollable.utils';

Scrollable.VerticalScrollbar = VerticalScrollbarPlaceholder;
Scrollable.VerticalScrollbar.Default = VerticalScrollbar;
Scrollable.HorizontalScrollbar = HorizontalScrollbarPlaceholder;
Scrollable.HorizontalScrollbar.Default = HorizontalScrollbar;
Scrollable.getThumbLength = getThumbLength;
Scrollable.getThumbPosition = getThumbPosition;
Scrollable.Shadow = Shadow;

export default Scrollable;
