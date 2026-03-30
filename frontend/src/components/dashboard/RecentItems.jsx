import { useEffect, useState } from "react";
import Card from "../ui/Card";
import ItemCard from "../item/ItemCard";
import { getItems } from "../../services/item.service";

export default function RecentItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const items = await getItems();
        setItems(items);
      } catch (err) {
        console.error("Error fetching items", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <Card className="col-span-2">
      <h2 className="mb-4 font-semibold">Recent Saves</h2>

      {loading ? (
        <p className="text-zinc-400">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-zinc-500">No items yet</p>
      ) : (
        <div className="space-y-3">
          {items.slice(0, 5).map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </Card>
  );
}