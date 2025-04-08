
import { ICartProduct } from './product';

export type ICartMap = Map<string, IUserCartMap>;

export type IUserCartMap = Map<string, ICartProduct>;
