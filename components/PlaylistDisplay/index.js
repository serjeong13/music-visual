import Image from "next/image";
import Link from "next/link";

export default function PlaylistDisplay({ list }) {
  return (
    <div className="p-4">
      <ul className="space-y-4">
        {list &&
          list.map((item) => (
            <li key={item.id} className="border-b border-gray-300 pb-2">
              <Link
                href={`/playlist/${item.id}`}
                className="flex items-center space-x-4"
              >
                <Image
                  src={item.images[0]?.url}
                  alt={item.name}
                  width={120}
                  height={120}
                />
                <div>
                  <h2 className="text-lg font-bold">{item.name}</h2>
                </div>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
