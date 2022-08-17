import * as React from 'react';

import { Button, Box, useColorModeValue, Modal, ModalContent } from '@chakra-ui/react';
import { HexColorPicker } from 'react-colorful';
import Dropzone, { DropzoneRef } from 'react-dropzone';
import ReactQuill from 'react-quill';

import { uploadFile, IFile } from './utils';

import 'react-quill/dist/quill.snow.css';

const ISMSIE = !!navigator.userAgent.match(/Trident/i);
const ISIOS = !!navigator.userAgent.match(/iPad|iPhone|iPod/i);

interface EditorState {
	contents: string;
	workings?: { [s: number]: boolean };
	fileIds?: string[];
}

interface EditorProps {
	contents: string;
	onChange?: (data: string) => void;
	isDisable?: boolean;
}

export interface EditorRef {
	submit: () => string;
}

type RangeStatic = { index: number; length: number };

const CustomToolbar: React.FC<{ isDisable?: boolean }> = ({ isDisable }) => {
	const bg = useColorModeValue('secondaryGray.100', 'secondaryGray.100');
	const [isOpenPickers, setIsOpenPicker] = React.useState(false);
	const [color, setColor] = React.useState('#fff');

	return (
		<Box
			id="toolbar"
			borderTopStartRadius="15px"
			borderTopEndRadius="15px"
			borderBottom="0px solid transparent !important"
			backgroundColor={bg}
		>
			<select className="ql-header" disabled={isDisable} onChange={e => e.persist()}>
				<option value="1">Heading 1</option>
				<option value="2">Heading 2</option>
				<option selected>Nomal</option>
			</select>
			<Button
				display="flex !important"
				justifyContent="center !important"
				alignItems="center !important"
				me="5px !important"
				className="ql-bold"
				isDisabled={isDisable}
			/>
			<Button
				display="flex !important"
				justifyContent="center !important"
				alignItems="center !important"
				me="5px !important"
				className="ql-italic"
				isDisabled={isDisable}
			/>
			<Button
				display="flex !important"
				justifyContent="center !important"
				alignItems="center !important"
				me="5px !important"
				className="ql-underline"
				isDisabled={isDisable}
			/>
			<Button
				variant="admin"
				display="flex !important"
				justifyContent="center !important"
				alignItems="center !important"
				me="5px !important"
				className="ql-list"
				value="ordered"
				isDisabled={isDisable}
			/>
			<Button
				display="flex !important"
				justifyContent="center !important"
				alignItems="center !important"
				className="ql-list"
				value="bullet"
				isDisabled={isDisable}
			/>
			<Button
				display="flex !important"
				justifyContent="center !important"
				alignItems="center !important"
				className="ql-image"
				value="image"
				isDisabled={isDisable}
			/>
			<Button
				display="flex !important"
				justifyContent="center !important"
				alignItems="center !important"
				className="ql-strike"
				value="strike"
				isDisabled={isDisable}
			/>
			<Button
				display="flex !important"
				justifyContent="center !important"
				alignItems="center !important"
				className="ql-blockquote"
				value="blockquote"
				isDisabled={isDisable}
			/>
			<Button
				display="flex !important"
				justifyContent="center !important"
				alignItems="center !important"
				className="ql-color"
				value={color}
				onClick={() => setIsOpenPicker(true)}
				isDisabled={isDisable}
			/>
			<Button
				display="flex !important"
				justifyContent="center !important"
				alignItems="center !important"
				className="ql-link"
				value="link"
				isDisabled={isDisable}
			/>
			<Button
				display="flex !important"
				justifyContent="center !important"
				alignItems="center !important"
				className="ql-video"
				value="video"
				isDisabled={isDisable}
			/>
			<Modal size="sm" isOpen={isOpenPickers} onClose={() => setIsOpenPicker(false)}>
				<ModalContent alignItems="center" bg="transparent">
					<HexColorPicker
						color={color}
						onChange={c => {
							setColor(c);
							setIsOpenPicker(false);
						}}
					/>
				</ModalContent>
			</Modal>
		</Box>
	);
};

export default class Editor extends React.Component<EditorProps, EditorState> {
	protected quillRef: ReactQuill | null = null;

	protected dropzone: DropzoneRef | null = null;

	protected onKeyEvent = false;

	protected formats = [
		'header',
		'bold',
		'italic',
		'underline',
		'strike',
		'blockquote',
		'size',
		'color',
		'list',
		'bullet',
		'indent',
		'link',
		'image',
		'video',
		'align',
	];

	protected modules;

	constructor(props: EditorProps) {
		super(props);
		const { contents } = props;
		this.state = {
			contents,
			workings: {},
			fileIds: [],
		};
		this.modules = {
			toolbar: {
				container: '#toolbar',
				handlers: {
					image: this.imageHandler,
				},
			},
			clipboard: { matchVisual: false },
		};
	}

	saveFile = (file: IFile) => {
		const { workings, fileIds } = this.state;
		const nowDate = new Date().getTime();
		const w = { ...workings, [nowDate]: true };
		this.setState({ workings });
		return uploadFile([file]).then(
			(results: IFile[]) => {
				const { sizeLargeUrl, objectId } = results[0];

				w[nowDate] = false;
				this.setState({
					workings,
					fileIds: fileIds ? [...fileIds, objectId || ''] : [objectId || ''],
				});
				return Promise.resolve({ url: sizeLargeUrl });
			},
			error => {
				console.error('saveFile error:', error);
				w[nowDate] = false;
				this.setState({ workings });
				return Promise.reject(error);
			},
		);
	};

	onDrop = async (acceptedFiles: IFile[]) => {
		try {
			await acceptedFiles.reduce((pacc, _file) => {
				return pacc.then(async () => {
					const { url } = await this.saveFile(_file);
					const quill = this.quillRef?.getEditor();
					if (!quill) return;
					const range = quill.getSelection();
					if (!range) return;
					quill.insertEmbed(range.index, 'image', url);
					quill.setSelection((range.index + 1) as unknown as RangeStatic);
					quill.focus();
				});
			}, Promise.resolve());
		} catch (error) {
			console.log(error);
		}
	};

	imageHandler = () => {
		if (this.dropzone) this.dropzone.open();
	};

	onKeyUp = (event: KeyboardEvent) => {
		if (!ISIOS) return;
		// enter
		if (event.keyCode === 13) {
			this.onKeyEvent = true;
			this.quillRef?.blur();
			this.quillRef?.focus();
			if (document.documentElement.className.indexOf('edit-focus') === -1) {
				document.documentElement.classList.toggle('edit-focus');
			}
			this.onKeyEvent = false;
		}
	};

	onFocus = () => {
		if (!this.onKeyEvent && document.documentElement.className.indexOf('edit-focus') === -1) {
			document.documentElement.classList.toggle('edit-focus');
			window.scrollTo(0, 0);
		}
	};

	onBlur = () => {
		if (!this.onKeyEvent && document.documentElement.className.indexOf('edit-focus') !== -1) {
			document.documentElement.classList.toggle('edit-focus');
		}
	};

	onChangeContents = (contents: string) => {
		let data = '';
		if (ISMSIE) {
			if (contents.indexOf('<p><br></p>') > -1) {
				data = contents.replace(/<p><br><\/p>/gi, '<p>&nbsp;</p>');
			}
		}
		this.setState({ contents: data || contents });
		const { onChange } = this.props;
		onChange?.(data || contents);
	};

	render() {
		const { contents } = this.state;
		const { isDisable } = this.props;

		return (
			<div className="text-editor">
				<CustomToolbar isDisable={isDisable} />
				<ReactQuill
					ref={el => {
						this.quillRef = el;
					}}
					value={contents}
					onChange={this.onChangeContents}
					onKeyUp={this.onKeyUp}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					modules={this.modules}
					formats={this.formats}
					readOnly={isDisable}
				/>
				<Dropzone
					ref={el => {
						this.dropzone = el;
					}}
					// eslint-disable-next-line @typescript-eslint/no-misused-promises
					onDrop={this.onDrop}
					accept={{ 'image/jpeg': [], 'image/png': [] }}
				>
					{({ getRootProps, getInputProps }) => (
						<div {...getRootProps()}>
							<input {...getInputProps()} />
						</div>
					)}
				</Dropzone>
			</div>
		);
	}
}

export const EditorWithRef = React.forwardRef<EditorRef, EditorProps>(({ contents, ...props }, ref) => {
	const [data, setData] = React.useState(contents);

	React.useImperativeHandle(
		ref,
		() => ({
			submit: () => data,
		}),
		[data],
	);

	return <Editor {...props} contents={data} onChange={d => setData(d)} />;
});
