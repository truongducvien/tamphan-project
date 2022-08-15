import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';

import {
	AspectRatio,
	Box,
	BoxProps,
	Button,
	CloseButton,
	forwardRef,
	Heading,
	Icon,
	Image,
	Input,
	Stack,
	Text,
	useDisclosure,
} from '@chakra-ui/react';
import { ModalImage } from 'components/modalImage';
import { useToastInstance } from 'components/toast';
import { motion, useAnimation } from 'framer-motion';
import useDidMount from 'hooks/useDidMount';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { loadImage, uploadFile } from 'services/file';

const first = {
	rest: {
		rotate: '-15deg',
		scale: 0.95,
		x: '-50%',
		filter: 'grayscale(80%)',
		transition: {
			duration: 0.5,
			type: 'tween',
			ease: 'easeIn',
		},
	},
	hover: {
		x: '-70%',
		scale: 1.1,
		rotate: '-20deg',
		filter: 'grayscale(0%)',
		transition: {
			duration: 0.4,
			type: 'tween',
			ease: 'easeOut',
		},
	},
};

const second = {
	rest: {
		rotate: '15deg',
		scale: 0.95,
		x: '50%',
		filter: 'grayscale(80%)',
		transition: {
			duration: 0.5,
			type: 'tween',
			ease: 'easeIn',
		},
	},
	hover: {
		x: '70%',
		scale: 1.1,
		rotate: '20deg',
		filter: 'grayscale(0%)',
		transition: {
			duration: 0.4,
			type: 'tween',
			ease: 'easeOut',
		},
	},
};

const third = {
	rest: {
		scale: 1.1,
		filter: 'grayscale(80%)',
		transition: {
			duration: 0.5,
			type: 'tween',
			ease: 'easeIn',
		},
	},
	hover: {
		scale: 1.3,
		filter: 'grayscale(0%)',
		transition: {
			duration: 0.4,
			type: 'tween',
			ease: 'easeOut',
		},
	},
};

interface PreviewImageProp extends BoxProps {
	src: string;
}
export type FileServiceType = 'PROPERTIES' | 'AREAS' | 'FACILITIES' | 'ARTICLES' | 'RESIDENT_CARD_REQUEST';

const PreviewImage = forwardRef<PreviewImageProp, typeof Box>(({ src, ...props }, ref) => {
	return (
		<Box
			bg="white"
			top="0"
			height="100%"
			width="100%"
			position="absolute"
			borderWidth="1px"
			borderStyle="solid"
			rounded="sm"
			borderColor="gray.400"
			as={motion.div}
			{...props}
			ref={ref}
		>
			<Image alt="" w="full" h="full" src={src} />
		</Box>
	);
});

const PreviewMoadle: React.FC<{ isOpen: boolean; onClose: () => void; files: string[] }> = ({
	isOpen,
	onClose,
	files,
}) => {
	const [current, setCurrent] = useState(0);
	const [src, setSrc] = useState<string>(files[0]);

	useEffect(() => {
		if (files[current]) setSrc(files[current]);
	}, [current, files]);

	return (
		<ModalImage
			closeOnEsc
			isOpen={isOpen}
			onClose={onClose}
			size="xl"
			src={src || ''}
			onNext={() => setCurrent(prev => prev + 1)}
			onPrev={() => setCurrent(prev => prev - 1)}
		/>
	);
};

interface Props {
	isMulti?: boolean;
	isDisabled?: boolean;
	defaultValue?: Array<string>;
	service?: FileServiceType;
}

export interface UploadImageRef {
	onSubmit: () => { files: string[] };
	onReset: () => void;
}

const UploadImage = React.forwardRef<UploadImageRef, Props>(({ isMulti, isDisabled, defaultValue, service }, ref) => {
	const controls = useAnimation();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { toast } = useToastInstance();
	const startAnimation = () => controls.start('hover');
	const stopAnimation = () => controls.stop();
	const [files, setFiles] = useState<string[]>([]);
	const fileRef = useRef<string[]>([]);
	useImperativeHandle(
		ref,
		() => ({
			onSubmit: () => {
				return { files: fileRef.current };
			},
			onReset: () => setFiles([]),
		}),
		[],
	);

	useDidMount(() => {
		const loadImg = async () => {
			if (!defaultValue) return [];
			const data: string[] = [];
			for await (const f of defaultValue) {
				await loadImage(f)
					.then(fileName => {
						data.push(fileName);
					})
					.catch(_ => console.log('can"t  load image'));
			}

			return data;
		};
		loadImg().then(d => {
			setFiles(d);
			fileRef.current = defaultValue || [];
		});
	});

	const onChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const prefiles = e.target.files;
		if (!prefiles?.[0]) return;
		try {
			const { data } = await uploadFile(prefiles, service || '');
			for (const prefile of prefiles) {
				const reader = new FileReader();
				reader.readAsDataURL(prefile);
				setFiles(prev => (isMulti ? [...prev, URL.createObjectURL(prefile)] : [URL.createObjectURL(prefile)]));
			}
			fileRef.current = data.items.map(i => i.fileId);
		} catch (error) {
			toast({
				status: 'error',
				title: 'Không thể tải file lên...',
			});
		}
	};

	const handleView = () => {
		onOpen();
	};

	return (
		<>
			<Box>
				<AspectRatio width="56" ratio={1}>
					<Box
						borderColor="gray.300"
						borderStyle="dashed"
						borderWidth={files?.[0] && !isMulti ? '0px' : '2px'}
						rounded="md"
						shadow="sm"
						role="group"
						transition="all 150ms ease-in-out"
						_hover={{
							shadow: 'md',
						}}
						as={motion.div}
						initial="rest"
						animate="rest"
						whileHover="hover"
					>
						<Box position="relative" height="100%" width="100%">
							<Box
								position="absolute"
								top="0"
								left="0"
								height="100%"
								width="100%"
								display="flex"
								flexDirection="column"
							>
								<Stack height="100%" width="100%" display="flex" alignItems="center" justify="center" spacing="4">
									{files?.[0] ? (
										isMulti ? (
											<Box height="16" width="12" position="relative">
												{files?.[1] && <PreviewImage variants={first} src={files[1]} />}
												{files?.[2] && <PreviewImage variants={second} src={files[2]} />}
												{files?.[0] && <PreviewImage variants={third} src={files[0]} />}
											</Box>
										) : (
											<Image alt="" w="56" h="56" src={files[0]} />
										)
									) : (
										<Icon as={FaCloudUploadAlt} width="50px" height="50px" />
									)}
									{isMulti || !files?.[0] ? (
										<Stack p="4" textAlign="center" spacing="1">
											<Heading fontSize="lg" variant="admin" fontWeight="bold">
												Drop images here
											</Heading>
											<Text fontWeight="light">or click to upload</Text>
										</Stack>
									) : null}
								</Stack>
							</Box>
							{files?.[0] && !isDisabled && (
								<Box
									position="absolute"
									top="0"
									right="0"
									onClick={() => {
										setFiles([]);
										fileRef.current = [];
									}}
									zIndex={10}
								>
									<CloseButton />
								</Box>
							)}
							{files?.[0] && isDisabled && (
								<Box position="absolute" top="40%" left="35%" onClick={handleView} zIndex={10}>
									<Button>Xem</Button>
								</Box>
							)}
							<Input
								type="file"
								height="100%"
								width="100%"
								position="absolute"
								top="0"
								left="0"
								opacity="0"
								aria-hidden="true"
								accept="image/*"
								multiple={isMulti}
								cursor="pointer"
								_disabled={{ opacity: '0' }}
								isDisabled={isDisabled}
								// eslint-disable-next-line @typescript-eslint/no-misused-promises
								onChange={onChangeFile}
								// eslint-disable-next-line @typescript-eslint/no-misused-promises
								onDragEnter={startAnimation}
								onDragLeave={stopAnimation}
							/>
						</Box>
					</Box>
				</AspectRatio>
			</Box>
			<PreviewMoadle onClose={onClose} files={files} isOpen={isOpen} />
		</>
	);
});

export default UploadImage;
