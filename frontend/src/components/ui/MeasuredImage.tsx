import Image, { type ImageProps } from 'next/image';
import { measuredMedia } from '@/lib/measured-media';

export default function MeasuredImage({ fill, style, ...props }: ImageProps) {
  const dimensions = fill ? measuredMedia(props.src) : undefined;
  return dimensions
    ? <Image {...props} {...dimensions} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }} />
    : <Image {...props} fill={fill} style={style} />;
}
