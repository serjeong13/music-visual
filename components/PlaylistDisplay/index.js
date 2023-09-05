import Image from "next/image";

export default function PlaylistDisplay({ list }) {
  return (
    <>
      {list &&
        list.map((item) => (
          <div key={item.id} className="flex justify-end items-center my-4">
            <h1 className="text-lg font-bold mx-4">{item.name}</h1>
            <Image
              src={item.images[0]?.url}
              alt={item.name}
              width={300}
              height={300}
            />
          </div>
        ))}
    </>
  );
}
