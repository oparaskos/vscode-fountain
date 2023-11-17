import { FountainElement, FountainElementType } from "./types/FountainElement";
import { FountainElementWithChildren } from "./types/FountainElementWithChildren";

export function getElementsByType<T extends FountainElement<U>, U extends FountainElementType = FountainElementType>(children: FountainElement[], type: U): T[] {
    const base: T[] = children.filter(child => child.type === type) as T[];
    const elementsWithChildren: FountainElementWithChildren[] = children.filter(child => child instanceof FountainElementWithChildren && child.children.length > 0) as FountainElementWithChildren[];
    const nested: T[] = elementsWithChildren.map(child => getElementsByType<T, U>(child.children, type)).flat();
    return [...base, ...nested];
}
