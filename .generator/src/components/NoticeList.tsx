import NoticeItem from '@/components/NoticeItem';
import { NoticeItem as NoticeItemType } from '@/types';

interface NoticeListProps {
  items: NoticeItemType[];
}

function NoticeList({ items }: NoticeListProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <NoticeItem item={item} key={item.id} />
      ))}
    </div>
  );
}

export default NoticeList;
