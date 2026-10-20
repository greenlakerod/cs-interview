// import { LinkedList } from "../linked-list/LinkedList";
import { LinkedListQueue } from "../queue/linked-list-queue";
import { LinkedListStack } from "../stack/linked-list-stack";

export class Graph<T> { // export class Graph {
  // Use a Map where the key is the vertex, and the value is a Set of adjacent vertices
  private _adjacencyMatrix: Map<T, Set<T>>; // Array<LinkedList<number>>;

  constructor() {
    this._adjacencyMatrix = new Map<T, Set<T>>();
  }
  // constructor(count?: number) {
  //   if (count !== undefined) {
  //     this._adjacencyMatrix = new Array<LinkedList<number>>(count);
  //   } else {
  //     this._adjacencyMatrix = [];
  //   }
  // }
  
  // public get count(): number { return this._adjacencyMatrix.length; }

  public get adjancencyMatrix(): Map<T, Set<T>> { return this._adjacencyMatrix; }
  // public get adjacencyMatrix(): Array<LinkedList<number>> { return this._adjacencyMatrix; }
  
  /**
   * Adds a new vertex to the graph if it doesn't already exist.
   */
  public addVertex(vertex: T): void {
    if (!this._adjacencyMatrix.has(vertex)) {
      this._adjacencyMatrix.set(vertex, new Set<T>());
    }
  }
  // public addVertex(vertex?: number): void {
  //   if (vertex != undefined) {
  //     if (!this._adjacencyMatrix[vertex]) {
  //         this._adjacencyMatrix[vertex] = new LinkedList<number>();
  //     }
  //   } else {
  //     this._adjacencyMatrix.push(new LinkedList<number>());
  //   }
  // }
  
  /**
   * Adds an edge (connection) between two vertices. 
   * Set 'directed' to true for a directed edge (origin -> destination)
   */
  public addEdge(vertex1: T, vertex2: T, directed = false): void {
    // Ensure both vertices exist in the graph first
    this.addVertex(vertex1);
    this.addVertex(vertex2);

    this._adjacencyMatrix.get(vertex1)!.add(vertex2);
    
    if (!directed) {
      this._adjacencyMatrix.get(vertex2)!.add(vertex1);
    }
  }
  // public addEdge(vertex: number, adjacentVertex: number): void {
  //   if (!this._adjacencyMatrix[vertex]) {
  //     throw `No vertex '${vertex}' exists`;
  //   }
  //   if (!this._adjacencyMatrix[adjacentVertex]) {
  //     throw `No vertex '${adjacentVertex}' exists`;
  //   }

  //   if (!this._adjacencyMatrix[vertex].contains(adjacentVertex)) {
  //     this._adjacencyMatrix[vertex].addLast(adjacentVertex);

  //     //for now, undirected. so add a reference the other way
  //     if (adjacentVertex != vertex) {
  //       this.addEdge(adjacentVertex, vertex);
  //     }
  //   }
  // }

  public removeEdge(vertex: T, adjacentVertex: T): void {
    if (!this._adjacencyMatrix.has(vertex)) {
      // throw `No vertex '${vertex}' exists`;
      return;
    }
    if (!this._adjacencyMatrix.has(adjacentVertex)) {
      // throw `No vertex '${adjacentVertex}' exists`;
      return;
    }
    
    const v1 = this._adjacencyMatrix.get(vertex);
    if (v1?.has(adjacentVertex)) {
      v1.delete(adjacentVertex);

      this._adjacencyMatrix.set(vertex, v1);

      // for now, undirected. so remove edge from adjacent vertex as well
      // if (adjacentVertex !== vertex) {
      //   this.removeEdge(adjacentVertex, vertex);
      // }
    }
  }
  // public removeEdge(vertex: number, adjacentVertex: number): void {
  //   if (!this._adjacencyMatrix[vertex]) {
  //     throw `No vertex '${vertex}' exists`;
  //   }
  //   if (!this._adjacencyMatrix[adjacentVertex]) {
  //     throw `No vertex '${adjacentVertex}' exists`;
  //   }

  //   if (!this._adjacencyMatrix[vertex].contains(adjacentVertex)) {
  //     this._adjacencyMatrix[vertex].remove(adjacentVertex);

  //     //for now, undirected. so remove the edge from the adjacent vertex as well
  //     if (adjacentVertex != vertex) {
  //       this.removeEdge(adjacentVertex, vertex);
  //     }
  //   }
  // }
  
  /**
   * Retrieves all the immediate neighbors of a given vertex.
   */
  public getNeighbors(vertex: T): T[] {
    const neighbors = this._adjacencyMatrix.get(vertex);
    return neighbors ? Array.from(neighbors) : [];
  }

  /**
   * Retrieves all vertices present in the graph.
   */
  public getAllVertices(): T[] {
    return Array.from(this._adjacencyMatrix.keys());
  }

  /**
   * Breadth-First Search (BFS)
   * Explores the graph layer by layer. Excellent for finding the shortest path.
   */
  public bfs(startVertex: T): T[] {
    if (!this._adjacencyMatrix.has(startVertex)) return [];

    // const queue: T[] = [startVertex];
    const queue = new LinkedListQueue<T>();
    queue.enqueue(startVertex);

    const visited = new Set<T>([startVertex]);
    const result: T[] = [];

    while (queue.count > 0) { // while (queue.length > 0) {
      const current = queue.dequeue(); // queue.shift()!;
      result.push(current as T);

      for (const neighbor of this.getNeighbors(current as T)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.enqueue(neighbor); // queue.push(neighbor);
        }
      }
    }
    return result;
  }

  /**
   * Depth-First Search (DFS) - Iterative
   * Explores as deep as possible along each branch before backtracking.
   */
  dfs(startVertex: T): T[] {
    if (!this._adjacencyMatrix.has(startVertex)) return [];

    // const stack: T[] = [startVertex];
    const stack = new LinkedListStack<T>();
    stack.push(startVertex);

    const visited = new Set<T>();
    const result: T[] = [];

    while (stack.size > 0) { // while (stack.length > 0) {
      const current = stack.pop()!;

      if (!visited.has(current)) {
        visited.add(current);
        result.push(current);

        // Push neighbors to stack (reverse order keeps typical left-to-right order)
        const neighbors = this.getNeighbors(current);
        for (let i = neighbors.length - 1; i >= 0; i--) {
          if (!visited.has(neighbors[i])) {
            stack.push(neighbors[i]);
          }
        }
      }
    }
    return result;
  }
  // public traverseBreadthFirst(vertex: number): Array<number> {
  //   let output: Array<number> = [];

  //   // Mark all the vertices as not visited
  //   let visited: Array<boolean> = new Array<boolean>(this.count).fill(false);

  //   // Mark the current node as visited and enqueue it
  //   let queue: IQueue = new LinkedListQueue();
  //   visited[vertex] = true;
  //   queue.enqueue(vertex);

  //   while (queue.count > 0) {
  //     let v = queue.dequeue();
  //     output.push(v);

  //     let list: LinkedList<number> = this._adjacencyMatrix[v];
  //     let iterator: Array<number> = new Array<number>(list.count);
  //     list.copyTo(iterator);

  //     for (let i = 0; i < iterator.length; i++) {
  //       let n = iterator[i];
  //       if (!visited[n]) {
  //         visited[n] = true;
  //         queue.enqueue(n);
  //       }
  //     }
  //   }

  //   return output;
  // }
  
  // public traverseDepthFirst(vertex: number): Array<number> {
  //   let output: Array<number> = [];

  //   // Mark all the vertices as not visited
  //   let visited: Array<boolean> = new Array<boolean>(this.count).fill(false);

  //   this._traverseDepthFirst(vertex, visited, output);

  //   return output;
  // }

  // private _traverseDepthFirst(vertex: number, visited: Array<boolean>, output: Array<number>) {
  //   visited[vertex] = true;
  //   output.push(vertex);

  //   let list: LinkedList<number> = this._adjacencyMatrix[vertex];
  //   let iterator: Array<number> = new Array<number>(list.count);
  //   list.copyTo(iterator);

  //   for (let i = 0; i < iterator.length; i++) {
  //     let n = iterator[i];
  //     if (!visited[n]) {
  //         this._traverseDepthFirst(n, visited, output);
  //     }
  //   }
  // }
  
  /**
   * Prints a visual representation of the adjacency list.
   */
  public printGraph(): void {
    for (const [vertex, edges] of this._adjacencyMatrix.entries()) {
      const edgeString = Array.from(edges).join(', ');
      console.log(`${vertex} -> [ ${edgeString} ]`);
    }
  }
}