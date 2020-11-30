/**
 * Copyright (c) 2020, Amdocs Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Context from './Poppable.context';
import Poppable from './Poppable.stateful';
import ManualPoppable from './Poppable';
import Triangle from './components/Triangle/Triangle';
// import AdjustablePoppable from './components/Adjustable';

Poppable.Context = Context;
Poppable.Manual = ManualPoppable;
Poppable.Triangle = Triangle;
// Poppable.Adjustable = AdjustablePoppable;

export default Poppable;
