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
} from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';

export interface Props extends Omit<AlertDialogProps, 'leastDestructiveRef' | 'children'> {
	title: string;
	body?: string;
}

const AlertDialog: React.FC<Props> = ({ isOpen, onClose, title, body }) => {
	const cancelRef = React.useRef<FocusableElement>(null);
	return (
		<RootAlertDialog
			motionPreset="slideInBottom"
			leastDestructiveRef={cancelRef}
			onClose={onClose}
			isOpen={isOpen}
			isCentered
		>
			<AlertDialogOverlay />
			<AlertDialogContent>
				<AlertDialogHeader>{title}</AlertDialogHeader>
				<AlertDialogCloseButton />
				<AlertDialogBody>{body}</AlertDialogBody>
				<AlertDialogFooter>
					<Button ref={cancelRef as React.LegacyRef<HTMLButtonElement>} onClick={onClose}>
						Huỷ
					</Button>
					<Button colorScheme="red" ml={3}>
						Đồng ý
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</RootAlertDialog>
	);
};

export default AlertDialog;
