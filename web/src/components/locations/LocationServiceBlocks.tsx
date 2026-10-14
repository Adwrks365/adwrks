import type { ServiceBlock } from "@/lib/pages/locations/types";

type LocationServiceBlocksProps = {
  blocks: readonly ServiceBlock[];
};

export function LocationServiceBlocks({ blocks }: LocationServiceBlocksProps) {
  return (
    <ul className="loc-service-blocks">
      {blocks.map((block) => (
        <li key={block.title} className="loc-service-block">
          <h3 className="loc-service-block-title">{block.title}</h3>
          <p className="loc-service-block-text">{block.text}</p>
        </li>
      ))}
    </ul>
  );
}
