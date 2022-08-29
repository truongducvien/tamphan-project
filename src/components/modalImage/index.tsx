import React, { useEffect, useRef } from 'react';

import {
	Button,
	Image,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalFooter,
	ModalBody,
	ModalProps,
	Box,
	Flex,
} from '@chakra-ui/react';
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
		<Modal aria-hidden {...modalProps} size="6xl" isCentered>
			<ModalOverlay>
				<ModalContent>
					<ModalBody>
						<TransformWrapper initialScale={1} centerOnInit ref={ref}>
							{({ zoomIn, zoomOut, resetTransform }) => (
								<div className="o-modalimage_container">
									<Box className="o-modalimage_tranform">
										<TransformComponent wrapperStyle={{ width: '100%', height: 'calc(100vh - 200px)' }}>
											<Image src={src} alt="" />
										</TransformComponent>
									</Box>

									<ModalFooter p={2} justifyContent="center">
										{onPrev && (
											<Button m={1} ref={prevRef} type="button" onClick={onPrev}>
												{'<<'}
											</Button>
										)}
										<Button m={1} type="button" onClick={() => zoomIn()}>
											+
										</Button>
										<Button m={1} type="button" onClick={() => zoomOut()}>
											-
										</Button>
										<Button m={1} type="button" onClick={() => resetTransform()}>
											R
										</Button>
										{onNext && (
											<Button m={1} type="button" ref={nextRef} onClick={onNext}>
												{'>>'}
											</Button>
										)}
									</ModalFooter>
								</div>
							)}
						</TransformWrapper>
					</ModalBody>
				</ModalContent>
			</ModalOverlay>
		</Modal>
	);
};
