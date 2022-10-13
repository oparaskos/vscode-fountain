import { FountainElement } from "./FountainElement";
import { FountainElementWithChildren } from "./FountainElementWithChildren";


export function getElementsByType<T extends FountainElement>(children: FountainElement[], type: string): T[] {
    const base: T[] = children.filter(child => child.type === type) as T[];
    const elementsWithChildren: FountainElementWithChildren[] = children.filter(child => child instanceof FountainElementWithChildren && child.children.length > 0) as FountainElementWithChildren[];
    const nested: T[] = elementsWithChildren.map(child => getElementsByType<T>(child.children, type)).flat();
    return [...base, ...nested];
}
