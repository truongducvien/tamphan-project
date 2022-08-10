import React, { useState } from 'react';

import {
	AspectRatio,
	Box,
	BoxProps,
	CloseButton,
	forwardRef,
	Heading,
	Icon,
	Image,
	Input,
	Stack,
	Text,
} from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';
import { FaCloudUploadAlt } from 'react-icons/fa';

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

interface Props {
	isMulti?: boolean;
	isDisabled?: boolean;
}

const UploadImage: React.FC<Props> = ({ isMulti, isDisabled }) => {
	const controls = useAnimation();
	const startAnimation = () => controls.start('hover');
	const stopAnimation = () => controls.stop();
	const [files, setFiles] = useState<string[]>([]);
	const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const prefiles = e.target.files;
		if (!prefiles?.[0]) return;
		for (let index = 0; index < prefiles.length; index += 1) {
			const reader = new FileReader();
			reader.readAsDataURL(prefiles[index]);
			setFiles(prev =>
				isMulti ? [...prev, URL.createObjectURL(prefiles[index])] : [URL.createObjectURL(prefiles[index])],
			);
		}
	};
	return (
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
						<Box position="absolute" top="0" left="0" height="100%" width="100%" display="flex" flexDirection="column">
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
						{files?.[0] && (
							<Box position="absolute" top="0" right="0" onClick={() => setFiles([])} zIndex={10}>
								<CloseButton />
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
							_disabled={{ opacity: '0' }}
							isDisabled={isDisabled}
							onChange={onChangeFile}
							// eslint-disable-next-line @typescript-eslint/no-misused-promises
							onDragEnter={startAnimation}
							onDragLeave={stopAnimation}
						/>
					</Box>
				</Box>
			</AspectRatio>
		</Box>
	);
};

export default UploadImage;
