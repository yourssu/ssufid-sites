import { NoticeItem as NoticeItemType } from "@/types";
import NoticeItem from "@/components/NoticeItem";

interface NoticeListProps {
  items: NoticeItemType[];
}

function NoticeList({ items }: NoticeListProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <NoticeItem key={item.id} item={item} />
      ))}
    </div>
  );
}

export default NoticeList;
