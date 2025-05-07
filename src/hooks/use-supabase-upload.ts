import { createClient } from '@/lib/supabase/client';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import {
	type FileError,
	type FileRejection,
	useDropzone,
} from 'react-dropzone';

const supabase = createClient();

interface FileWithPreview extends File {
	preview?: string;
	errors: readonly FileError[];
}

type UseSupabaseUploadOptions = {
	/**
	 * Name of bucket to upload files to in your Supabase project
	 */
	bucketName: string;
	/**
	 * Folder to upload files to in the specified bucket within your Supabase project.
	 *
	 * Defaults to uploading files to the root of the bucket
	 *
	 * e.g If specified path is `test`, your file will be uploaded as `test/file_name`
	 */
	path?: string;
	/**
	 * Allowed MIME types for each file upload (e.g `image/png`, `text/html`, etc). Wildcards are also supported (e.g `image/*`).
	 *
	 * Defaults to allowing uploading of all MIME types.
	 */
	allowedMimeTypes?: string[];
	/**
	 * Maximum upload size of each file allowed in bytes. (e.g 1000 bytes = 1 KB)
	 */
	maxFileSize?: number;
	/**
	 * Maximum number of files allowed per upload.
	 */
	maxFiles?: number;
	/**
	 * The number of seconds the asset is cached in the browser and in the Supabase CDN.
	 *
	 * This is set in the Cache-Control: max-age=<seconds> header. Defaults to 3600 seconds.
	 */
	cacheControl?: number;
	/**
	 * When set to true, the file is overwritten if it exists.
	 *
	 * When set to false, an error is thrown if the object already exists. Defaults to `false`
	 */
	upsert?: boolean;
	/**
	 * Callback fired for each successfully uploaded file.
	 * It receives an object containing the file name and its public URL.
	 */
	onUploadSuccess?: (file: { name: string; publicUrl: string }) => void;
};

type UseSupabaseUploadReturn = ReturnType<typeof useSupabaseUpload>;

const useSupabaseUpload = (options: UseSupabaseUploadOptions) => {
	const {
		bucketName,
		path,
		allowedMimeTypes = [],
		maxFileSize = Number.POSITIVE_INFINITY,
		maxFiles = 1,
		cacheControl = 3600,
		upsert = false,
		onUploadSuccess,
	} = options;

	const [files, setFiles] = useState<FileWithPreview[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [errors, setErrors] = useState<{ name: string; message: string }[]>(
		[]
	);
	const [successes, setSuccesses] = useState<string[]>([]);

	const onUploadSuccessCallbackRef = useRef(onUploadSuccess);

	useEffect(() => {
		onUploadSuccessCallbackRef.current = onUploadSuccess;
	}, [onUploadSuccess]);

	const isSuccess = useMemo(() => {
		if (errors.length === 0 && successes.length === 0) {
			return false;
		}
		if (errors.length === 0 && successes.length === files.length) {
			return true;
		}
		return false;
	}, [errors.length, successes.length, files.length]);

	const onDrop = useCallback(
		(acceptedFiles: File[], fileRejections: FileRejection[]) => {
			const validFiles = acceptedFiles
				.filter((file) => !files.find((x) => x.name === file.name))
				.map((file) => {
					(file as FileWithPreview).preview =
						URL.createObjectURL(file);
					(file as FileWithPreview).errors = [];
					return file as FileWithPreview;
				});

			const invalidFiles = fileRejections.map(({ file, errors }) => {
				(file as FileWithPreview).preview = URL.createObjectURL(file);
				(file as FileWithPreview).errors = errors;
				return file as FileWithPreview;
			});

			const newFiles = [...files, ...validFiles, ...invalidFiles];

			setFiles(newFiles);
		},
		[files, setFiles]
	);

	const dropzoneProps = useDropzone({
		onDrop,
		noClick: true,
		accept: allowedMimeTypes.reduce(
			(acc, type) => ({ ...acc, [type]: [] }),
			{}
		),
		maxSize: maxFileSize,
		maxFiles: maxFiles,
		multiple: maxFiles !== 1,
	});

	const onUpload = useCallback(async () => {
		setLoading(true);

		// Filter for files that are valid (no client-side errors) and not yet successfully uploaded
		const filesToUpload = files.filter(
			(file) =>
				!successes.includes(file.name) &&
				(file as FileWithPreview).errors.length === 0
		);

		if (filesToUpload.length === 0) {
			setLoading(false);
			return;
		}

		const responses = await Promise.all(
			filesToUpload.map(async (file) => {
				const filePath = !!path ? `${path}/${file.name}` : file.name;
				const { error: uploadError } = await supabase.storage
					.from(bucketName)
					.upload(filePath, file, {
						cacheControl: cacheControl.toString(),
						upsert,
					});

				if (uploadError) {
					return {
						name: file.name,
						message: uploadError.message,
						publicUrl: null,
					};
				} else {
					// Upload was successful, now get public URL
					const { data: publicUrlData } =
						await supabase.storage
							.from(bucketName)
							.getPublicUrl(filePath);

					// if (getUrlError) {
					// 	console.error(
					// 		`Failed to get public URL for ${file.name}: ${(getUrlError as any)?.message || 'Unknown error fetching URL'}`
					// 	);
					// 	// The upload was successful, but we couldn't get the public URL.
					// 	// We'll mark it as a success for upload tracking, but won't call onUploadSuccess with a URL.
					// 	return {
					// 		name: file.name,
					// 		message: undefined,
					// 		publicUrl: null,
					// 		errorFetchingUrl: true,
					// 	};
					// }

					if (
						publicUrlData &&
						typeof publicUrlData.publicUrl === 'string' &&
						onUploadSuccessCallbackRef.current
					) {
						onUploadSuccessCallbackRef.current({
							name: file.name,
							publicUrl: publicUrlData.publicUrl,
						});
					}
					return {
						name: file.name,
						message: undefined,
						publicUrl: publicUrlData?.publicUrl || null,
					};
				}
			})
		);

		const responseErrors = responses.filter((x) => x.message !== undefined);
		// if there were errors previously, this function tried to upload the files again so we should clear/overwrite the existing errors.
		setErrors(responseErrors);

		const responseSuccesses = responses.filter(
			(x) => x.message === undefined
		);
		const newSuccesses = Array.from(
			new Set([...successes, ...responseSuccesses.map((x) => x.name)])
		);
		setSuccesses(newSuccesses);

		setLoading(false);
	}, [
		files,
		path,
		bucketName,
		cacheControl,
		upsert,
		successes,
		// onUploadSuccessCallbackRef is stable, so not needed in deps directly for the callback function itself
	]);

	useEffect(() => {
		if (files.length === 0) {
			setErrors([]);
		}

		// If the number of files doesn't exceed the maxFiles parameter, remove the error 'Too many files' from each file
		if (files.length <= maxFiles) {
			let changed = false;
			const newFiles = files.map((file) => {
				if (file.errors.some((e) => e.code === 'too-many-files')) {
					file.errors = file.errors.filter(
						(e) => e.code !== 'too-many-files'
					);
					changed = true;
				}
				return file;
			});
			if (changed) {
				setFiles(newFiles);
			}
		}
	}, [files.length, setFiles, maxFiles]);

	return {
		files,
		setFiles,
		successes,
		isSuccess,
		loading,
		errors,
		setErrors,
		onUpload,
		maxFileSize: maxFileSize,
		maxFiles: maxFiles,
		allowedMimeTypes,
		...dropzoneProps,
	};
};

export {
	useSupabaseUpload,
	type UseSupabaseUploadOptions,
	type UseSupabaseUploadReturn,
};
