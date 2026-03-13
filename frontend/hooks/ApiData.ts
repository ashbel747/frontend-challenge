// services/api.ts
const BASE_URL = "https://jsonplaceholder.typicode.com";

export const fetchClusters = async () => {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error("Failed to fetch clusters");
  const data = await res.json();
  // Map User to Cluster shape
  return data.map((user: any) => ({
    id: user.id.toString(),
    name: user.company.name,
    cpu: user.id * 100,
    ram: user.id * 50,
    storage: user.id * 10,
    total: user.id * 160,
  }));
};

export const fetchNamespaces = async (clusterId: string) => {
  const res = await fetch(`${BASE_URL}/posts?userId=${clusterId}`);
  if (!res.ok) throw new Error("Failed to fetch namespaces");
  const data = await res.json();
  // Map Post to Namespace shape
  return data.map((post: any) => ({
    id: post.id.toString(),
    name: post.title.slice(0, 15),
    cpu: post.id * 10,
    ram: post.id * 5,
    storage: post.id * 2,
    total: post.id * 17,
  }));
};

export const fetchPods = async (namespaceId: string) => {
  const res = await fetch(`${BASE_URL}/comments?postId=${namespaceId}`);
  if (!res.ok) throw new Error("Failed to fetch pods");
  const data = await res.json();
  // Map Comment to Pod shape
  return data.map((comment: any) => ({
    id: comment.id.toString(),
    name: comment.name.split(" ")[0],
    cpu: comment.id,
    ram: comment.id / 2,
    storage: comment.id / 5,
    total: comment.id * 1.7,
  }));
};