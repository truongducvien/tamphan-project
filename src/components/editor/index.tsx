/* eslint-disable jsx-a11y/control-has-associated-label */
import * as React from 'react';

import { Box, useColorModeValue, createStandaloneToast } from '@chakra-ui/react';
import Dropzone, { DropzoneRef } from 'react-dropzone';
import ReactQuill from 'react-quill';

import { uploadFile } from './utils';

import 'react-quill/dist/quill.snow.css';

const { ToastContainer, toast } = createStandaloneToast();

const ISMSIE = !!navigator.userAgent.match(/Trident/i);
const ISIOS = !!navigator.userAgent.match(/iPad|iPhone|iPod/i);

interface EditorState {
	contents: string;
	workings?: { [s: number]: boolean };
	fileIds?: string[];
}

interface EditorProps {
	contents?: string;
	onChange?: (data: string) => void;
	isDisable?: boolean;
}

export interface EditorRef {
	submit: () => string;
}

type RangeStatic = { index: number; length: number };

const CustomToolbar: React.FC<{ isDisable?: boolean }> = () => {
	const bg = useColorModeValue('secondaryGray.100', 'secondaryGray.100');

	return (
		<Box
			id="toolbar"
			borderTopStartRadius="15px"
			borderTopEndRadius="15px"
			borderBottom="0px solid transparent !important"
			backgroundColor={bg}
		>
			<span className="ql-formats">
				<select className="ql-font" />
				<select className="ql-size" />
			</span>
			<span className="ql-formats">
				<button type="button" className="ql-bold" />
				<button type="button" className="ql-italic" />
				<button type="button" className="ql-underline" />
				<button type="button" className="ql-strike" />
			</span>
			<span className="ql-formats">
				<select className="ql-color" />
				<select className="ql-background" />
			</span>
			<span className="ql-formats">
				<button type="button" className="ql-script" value="sub" />
				<button type="button" className="ql-script" value="super" />
			</span>
			<span className="ql-formats">
				<button type="button" className="ql-header" value="1" />
				<button type="button" className="ql-header" value="2" />
				<button type="button" className="ql-blockquote" />
				<button type="button" className="ql-code-block" />
			</span>
			<span className="ql-formats">
				<button type="button" className="ql-list" value="ordered" />
				<button type="button" className="ql-list" value="bullet" />
				<button type="button" className="ql-indent" value="-1" />
				<button type="button" className="ql-indent" value="+1" />
			</span>
			<span className="ql-formats">
				<button type="button" className="ql-direction" value="rtl" />
				<span className="ql-formats">
					<button type="button" className="ql-align" value="" />
					<button type="button" className="ql-align" value="center" />
					<button type="button" className="ql-align" value="right" />
					<button type="button" className="ql-align" value="justify" />
				</span>
			</span>
			<span className="ql-formats">
				<button type="button" className="ql-link" />
				<button type="button" className="ql-image" />
				<button type="button" className="ql-video" />
				<button type="button" className="ql-formula" />
			</span>
			<span className="ql-formats">
				<button type="button" className="ql-clean" />
			</span>
		</Box>
	);
};

export default class Editor extends React.Component<EditorProps, EditorState> {
	protected quillRef: ReactQuill | null = null;

	protected dropzone: DropzoneRef | null = null;

	protected onKeyEvent = false;

	protected formats = [
		'script',
		'font',
		'header',
		'bold',
		'italic',
		'underline',
		'strike',
		'blockquote',
		'size',
		'color',
		'background',
		'list',
		'bullet',
		'indent',
		'link',
		'image',
		'video',
		'align',
		'formula',
		'clean',
		'code-block',
		'direction',
		'formula',
	];

	protected modules;

	constructor(props: EditorProps) {
		super(props);
		const { contents } = props;
		this.state = {
			contents: contents || '',
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
		this.onChangeContents = this.onChangeContents.bind(this);
	}

	saveFile = (file: File) => {
		const { workings, fileIds } = this.state;
		const nowDate = new Date().getTime();
		const w = { ...workings, [nowDate]: true };
		this.setState({ workings });
		return uploadFile([file]).then(
			results => {
				const { link, fileId } = results?.data?.items?.[0] || {};
				w[nowDate] = false;
				this.setState({
					workings,
					fileIds: fileIds ? [...fileIds, fileId || ''] : [fileId || ''],
				});
				if (!link) throw new Error('!link');
				return Promise.resolve({
					url: `${process.env.REACT_APP_API_BASE_URL || 'https://aquacity.staging.novaid.vn/web/api/'}${link || ''}`,
				});
			},
			error => {
				console.error('saveFile error:', error);
				w[nowDate] = false;
				this.setState({ workings });
				return Promise.reject(error);
			},
		);
	};

	onDrop = async (acceptedFiles: File[]) => {
		try {
			await acceptedFiles.reduce((pacc, _file) => {
				return pacc.then(async () => {
					const { url } = await this.saveFile(_file);
					if (!url) return;
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
			toast({
				title: 'Không thể tải file lên',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'top-right',
			});
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
			<div className="text-editor" data-text-editor="name">
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
					bounds={`[data-text-editor="name"]`}
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
				<ToastContainer />
			</div>
		);
	}
}

export const EditorWithRef = React.forwardRef<EditorRef, EditorProps>(({ contents, ...props }, ref) => {
	const [data, setData] = React.useState(contents);

	React.useImperativeHandle(
		ref,
		() => ({
			submit: () => data || '',
		}),
		[data],
	);

	return <Editor {...props} contents={data} onChange={setData} />;
});
