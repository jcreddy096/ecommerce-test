import { ICartProduct } from './product';

export type ICartMap = Record<string, Record<string, ICartProduct>>;

export type IUserCartMap = Record<string, ICartProduct>;



