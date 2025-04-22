import { useState } from 'react';
import MyWeb3Helper from './MyWeb3Helper';
import MyWeb3Storage from './MyWeb3Storage';


function AddNftForm(props) {
    const [name, setName] = useState('');
    const [pdfFile, setPdfFile] = useState(null);
    const [institution, setInstitution] = useState('');

    function handleFileUpload(event) {
        const file = event.target.files[0]
        if (file.type === 'application/pdf') {
            const pdfFileFormated = new File([file], file.name, { type: 'application/pdf' })
            setPdfFile(pdfFileFormated);
        } else {
            alert('Please select a PDF file.')
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!pdfFile || !name || !institution) {
            alert('Please fill all the parameters');
            return;
        }
        debugger
        console.log(pdfFile);
        const web3Storage = new MyWeb3Storage();
        const cid = await web3Storage.storeFiles(pdfFile)

        const web3Helper = new MyWeb3Helper();
        await web3Helper.connect();
        await web3Helper.mintNFT(name, cid, institution);
    };


    return (
        <div className="add-nft-form">
            <h2>Add New NFT</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="pdfFile">PDF File</label>
                    <input
                        type="file"
                        id="pdfFile"
                        onChange={handleFileUpload}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="institution">Institution</label>
                    <input
                        type="text"
                        id="institution"
                        value={institution}
                        onChange={(event) => setInstitution(event.target.value)}
                        required
                    />
                </div>
                <button type="submit">Add NFT</button>
            </form>
        </div>
    );
}

export default AddNftForm;
