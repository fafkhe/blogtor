import { SortOrder } from "mongoose"

export type SortObject = {
  [key: string]: SortOrder
}

export type customSortType = {
  latest: SortObject
  oldest: SortObject
  like: SortObject
}