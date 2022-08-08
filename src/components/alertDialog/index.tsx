import React from 'react';

import {
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	Button,
	AlertDialog as RootAlertDialog,
	AlertDialogCloseButton,
	AlertDialogProps,
	useColorModeValue,
} from '@chakra-ui/react';

export interface Props extends Omit<AlertDialogProps, 'leastDestructiveRef' | 'children'> {
	title: string;
	centerTitle?: boolean;
	body?: React.ReactNode;
	onConfirm?: () => void;
	type?: 'default' | 'error';
}

const AlertDialog: React.FC<Props> = ({
	isOpen,
	centerTitle = true,
	onClose,
	onConfirm,
	title,
	body,
	type = 'default',
}) => {
	const color = useColorModeValue('red.400', 'red.600');
	const cancelRef = React.useRef<HTMLButtonElement>(null);
	return isOpen ? (
		<RootAlertDialog
			motionPreset="slideInBottom"
			leastDestructiveRef={cancelRef}
			onClose={onClose}
			isOpen={isOpen}
			isCentered
		>
			<AlertDialogOverlay />
			<AlertDialogContent>
				<AlertDialogHeader textAlign={centerTitle ? 'center' : 'start'} color={type === 'error' ? color : 'whitesmoke'}>
					{title}
				</AlertDialogHeader>
				<AlertDialogCloseButton />
				<AlertDialogBody>{body}</AlertDialogBody>
				<AlertDialogFooter>
					<Button ref={cancelRef} onClick={onClose}>
						Huỷ
					</Button>
					<Button colorScheme="red" ml={3} onClick={onConfirm}>
						Đồng ý
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</RootAlertDialog>
	) : null;
};

export default AlertDialog;
