import React, {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';
import './styles.css';

// Inferface para função
interface Props {
    onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onFileUploaded }) => {

    const [selectedFileUrl,setSelectedFileUrl] = useState('');

    // useCallback é nativa do react para conseguir memorizar uma função para que ela seja recarregada, somente quando um valor de uma variável mudar
    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        const fileUrl = URL.createObjectURL(file);

        setSelectedFileUrl(fileUrl);

        onFileUploaded(file);
        
    }, [onFileUploaded]);

    const {getRootProps, getInputProps} = useDropzone({
        onDrop,
        accept: 'image/*'
    });

    return (
        <div className="dropzone" {...getRootProps()}>
            <input {...getInputProps()} accept="image/*"/>

            {selectedFileUrl
                ? <img src={selectedFileUrl} alt="Point Thumbnail"/>
                : (
                    <p>
                    <FiUpload />
                    Imagem do estabelecimento aqui
                    </p>
                )
            }

        </div>
    )
}
export default Dropzone;