import React, { useEffect, useRef } from 'react';

import { Button, Image, Modal, ModalOverlay, ModalContent, ModalFooter, ModalBody, ModalProps } from '@chakra-ui/react';
import { TransformComponent, ReactZoomPanPinchRef, TransformWrapper } from 'react-zoom-pan-pinch';

import './index.scss';

export interface Props extends Omit<ModalProps, 'children'> {
	onNext?: () => void;
	src: string;
	onPrev?: () => void;
}

export const ModalImage: React.FC<Props> = ({ src, onPrev, onNext, ...modalProps }) => {
	const ref = useRef<ReactZoomPanPinchRef>(null);
	const nextRef = useRef<HTMLButtonElement>(null);
	const prevRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const keyHandle = (e: KeyboardEvent) => {
			if (e.key === 'ArrowRight') {
				nextRef?.current?.click();
			}
			if (e.key === 'ArrowLeft') {
				prevRef?.current?.click();
			}
		};
		window.addEventListener('keyup', keyHandle);
		return () => window.removeEventListener('keyup', keyHandle);
	}, []);

	useEffect(() => {
		ref.current?.resetTransform();
	}, [src]);

	return (
		<Modal aria-hidden {...modalProps} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalBody>
					<TransformWrapper initialScale={1} centerOnInit ref={ref}>
						{({ zoomIn, zoomOut, resetTransform }) => (
							<div className="d-flex align-items-center justify-content-center o-modalimage_container">
								<TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
									<Image src={src} alt="" />
								</TransformComponent>
								<ModalFooter p={2} justifyContent="center">
									<Button m={1} ref={prevRef} type="button" onClick={onPrev}>
										{'<<'}
									</Button>
									<Button m={1} type="button" onClick={() => zoomIn()}>
										+
									</Button>
									<Button m={1} type="button" onClick={() => zoomOut()}>
										-
									</Button>
									<Button m={1} type="button" onClick={() => resetTransform()}>
										0
									</Button>
									<Button m={1} type="button" ref={nextRef} onClick={onNext}>
										{'>>'}
									</Button>
								</ModalFooter>
							</div>
						)}
					</TransformWrapper>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
