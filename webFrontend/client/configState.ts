/*
Copyright (c) 2021, Oscar Chavarro (jedilink@gmail.com)
This code is closed source / propertary. Do not redistribute.
DISPLAIMER: Use AS IS, author is not responsible of any damages
caused by the misuse of this software.
*/

import { Model } from './model/Model';

/**
This object contains the initial state for the application. It is an instance of
the Model class and it will mutate on each operation change.

Object is unique, should follow singleton design pattern.
*/
export const globalModel: Model = new Model();
