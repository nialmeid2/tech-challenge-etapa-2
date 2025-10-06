import { ButtonHTMLAttributes, useRef, useState } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    accept: string,
    multiple: boolean,
    saveBase64Attachment: (attachment: string | ArrayBuffer | null | undefined) => void
}

export default function FileUploader({accept, multiple, saveBase64Attachment, ...rest}: Props) {

    const fileRef = useRef<HTMLInputElement>(null);

    const [showPreview, setShowPreview] = useState(false);
    const [chosenFile, setChosenFile] = useState<File>();
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    function startFile(file: File) {
        const theFile = file;
        setChosenFile(theFile);


        setIsLoading(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target!.result;
            setIsLoading(false);
            saveBase64Attachment(base64);
            setChosenFile(theFile);
        }
        reader.readAsDataURL(theFile);

    }

    async function getChosenFile(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        e.stopPropagation();

        if (!e.target.files?.length) {
            setIsLoading(false);
            saveBase64Attachment(undefined);
            setChosenFile(undefined);  
            return;          
        }

        const acceptedFormats = accept.split(/,\s*/gi);
        const adheresToFormat = [...e.target.files!].some((s) => acceptedFormats.some((af) => s.name.endsWith(af)));


        if (!adheresToFormat) {
            setErrorMsg(`Formatos aceitos: ${accept}`);
            return;
        }
        
        
        setChosenFile(e.target.files[0]);
        startFile(e.target.files[0]!);
    }

    function getPreview(e: React.DragEvent<HTMLButtonElement>) {
        e.preventDefault();
        e.stopPropagation();

        setShowPreview(true);

    }

    function stopDrop(e: React.DragEvent<HTMLButtonElement>) {
        e.preventDefault();
        e.stopPropagation();

        setShowPreview(false);
        setErrorMsg('');
    }

    function getDraggedFile(e: React.DragEvent<HTMLButtonElement>) {
        e.preventDefault();
        e.stopPropagation();

        setShowPreview(false);
        setErrorMsg('');

        if (!e.dataTransfer.files?.length) {
            setErrorMsg('Please, Select a file to drop or click the button to select one')
            return;
        }

        const acceptedFormats = accept.split(/,\s*/gi);

        const adheresToFormat = [...e.dataTransfer.files].some((s) => acceptedFormats.some((af) => s.name.endsWith(af)));


        if (!adheresToFormat) {
            setErrorMsg(`Formatos aceitos: ${accept}`);
            return;
        }

        startFile(e.dataTransfer.files[0]!);

    }

    return <>
        
        <input ref={fileRef} style={{ display: 'none' }} type="file" className="hidden" accept={accept} onChange={(e) => getChosenFile(e)} multiple={multiple} />

        <button {...rest} type="button" className={`border-[.25em] leading-[1.2] border-dashed w-[100%] p-[1em] px-[2em] cursor-pointer hover:underline ${showPreview ? 'dark:bg-neutral-900/50 bg-neutral-200/50' : ''} ${rest.className}`}
            onDragOver={(e) => getPreview(e)} onDragLeave={(e) => stopDrop(e)}
            onDrop={(e) => getDraggedFile(e)} onClick={() => fileRef.current?.click()}  >
            <span className="pointer-events-none text-[1.2em]">
                {showPreview ? <>

                    <i className="bi bi-file-earmark-arrow-up text-[2em] align-middle"></i>
                    Solte seu anexo Aqui

                </> : <>
                    <i className="bi bi-cloud-arrow-up-fill text-[2em] align-middle"></i>
                    {errorMsg ? errorMsg : chosenFile ? '' : 'Solte seu comprovante ou clique aqui para subir seu arquivo'}
                    {chosenFile ? <>{isLoading ? 'Carregando arquivo...' : chosenFile.name}</> : ''}
                </>}
            </span>
        </button>

    </>
}