export default function ItemCard({ item }) {
  return (
    <div className="bg-zinc-800 p-3 rounded">
      <h3 className="font-semibold">{item.title}</h3>
    </div>
  );
}