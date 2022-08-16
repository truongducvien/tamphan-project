import React from 'react';

import { Image, ImageProps, Spinner, useDisclosure } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { ModalImage } from 'components/modalImage';
import { loadImage } from 'services/file';

export interface LazyImageProp extends ImageProps {
	src: string;
}

export const LazyImage: React.FC<LazyImageProp> = ({ src, w = 100, h = 100, ...innerProps }) => {
	const { data, isLoading } = useQuery([`img-${src}`, src], () => loadImage(src));
	const { isOpen, onOpen, onClose } = useDisclosure();
	if (!data) return null;
	return (
		<>
			{isLoading ? (
				<Spinner size="sm" />
			) : (
				<Image loading="lazy" w={w} h={h} {...innerProps} onClick={onOpen} src={data} />
			)}
			<ModalImage isOpen={isOpen} onClose={onClose} src={data} />
		</>
	);
};
