import { useRef } from 'react';

import {
	Button,
	FormControl,
	FormLabel,
	Heading,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	SimpleGrid,
} from '@chakra-ui/react';
import UploadImage, { UploadImageRef } from 'src/components/fileUpload';
import { FormContainer } from 'src/components/form';
import { DatePickerHookForm } from 'src/components/form/DatePicker';
import { PullDownHookForm } from 'src/components/form/PullDown';
import { TextAreaFieldHookForm } from 'src/components/form/TextAreaField';

export interface Props {
	isOpen: boolean;
	onClose(): void;
}

const ModalAddTask: React.FC<Props> = ({ isOpen, onClose }) => {
	const fileRef = useRef<UploadImageRef>(null);
	return (
		<Modal size="3xl" isOpen={isOpen} isCentered onClose={onClose} closeOnEsc closeOnOverlayClick>
			<ModalOverlay>
				<ModalContent>
					<ModalHeader>
						<Heading size="md">Thêm công việc</Heading>
					</ModalHeader>
					<ModalBody>
						<FormContainer>
							<SimpleGrid spacing="3">
								<DatePickerHookForm label="Ngày hết hạn" name="date" />
								<PullDownHookForm options={[]} label="Người nhận" name="recept" />
								<TextAreaFieldHookForm label="Nội dung" name="content" />
								<FormControl>
									<FormLabel>Đính kèm</FormLabel>
									<UploadImage ref={fileRef} />
								</FormControl>
							</SimpleGrid>
						</FormContainer>
					</ModalBody>

					<ModalFooter>
						<Button variant="gray" mr="3" onClick={onClose}>
							Huỷ
						</Button>
						<Button variant="brand" onClick={onClose}>
							Xác nhận
						</Button>
					</ModalFooter>
				</ModalContent>
			</ModalOverlay>
		</Modal>
	);
};

export default ModalAddTask;
