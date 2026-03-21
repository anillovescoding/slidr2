import { pb } from '@/lib/pocketbase';
import { Slide } from '@/store/useEditorStore';
import { notFound } from 'next/navigation';
import { PublicCarouselViewer } from '@/components/carousel/PublicCarouselViewer';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PublicCarouselPage({ params }: Props) {
  const { id } = await params;

  let share;
  try {
    share = await pb.collection('shares').getOne(id, { expand: 'carousel_id' });
  } catch {
    notFound();
  }

  const carousel = share.expand?.carousel_id;
  if (!carousel) notFound();

  const slides: Slide[] = Array.isArray(carousel.slides_data) ? carousel.slides_data : [];

  return (
    <PublicCarouselViewer
      title={carousel.title as string}
      slides={slides}
    />
  );
}
