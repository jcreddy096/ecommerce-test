import { Product } from "./product"

export type UpdateCart = {
    id: number,
    userId: number
    products: Product[]
}