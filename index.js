const fs = require('fs').promises;
const validator = require('validator');
const readline = require('readline')


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (prompt) => {
    return new Promise((resolve) => {
        rl.question(prompt, (answer) => {
            resolve(answer);
        });
    });
};

const dataPath = './data/contacts.json';

const buatFolderDanFile = async () => {
    try {
        await fs.mkdir('./data');
        console.log("Folder 'data' berhasil dibuat.");
    } catch (error) {
        if (error.code === 'EEXIST') {
            console.log("Folder 'data' sudah ada.");
        } else {
            console.error("Terjadi kesalahan saat membuat folder: ", error);
        }
    }

    try {
        await fs.access(dataPath);
        console.log("File 'contacts.json' sudah ada.");
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(dataPath, '[]', 'utf-8');
            console.log('File contacts.json berhasil dibuat.');
        } else {
            console.error("Terjadi kesalahan saat membuat file: ", error);
        }
    }
};

const simpanDataKeJSON = async (data) => {
    try {
        await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8');
        console.log('Data berhasil disimpan ke contacts.json.');
    } catch (error) {
        console.error("Terjadi kesalahan saat menyimpan data ke JSON: ", error);
    }
};

const tambahDataKeJSON = async (nama, handphone, email) => {
    await buatFolderDanFile();

    // Validasi input kosong
    if (!nama) {
        console.log('Nama harus diisi. Silakan coba lagi.');
        return false;
    }

    // Validasi nama tidak boleh sama dengan yang sudah ada
    const existingData = JSON.parse(await fs.readFile(dataPath, 'utf-8'));
    const isNamaExist = existingData.some(contact => contact.nama === nama);
    if (isNamaExist) {
        console.log('Nama yang diinput sudah ada dalam data. Silakan coba dengan nama lain.');
        return false;
    }
    
    
    // Validasi nomor handphone
    if(handphone && !validator.isMobilePhone(handphone, 'id-ID')) {
        console.log('Nomor Handphone tidak valid. Silakan coba lagi.');
        return false;
    }

    // Validasi email
    if(email && !validator.isEmail(email)) {
        console.log('Alamat email tidak valid. Silakan coba lagi.');
        return false;
    }

    
    existingData.push({nama, handphone, email});
    await simpanDataKeJSON(existingData);
    // console.log(`Nama saya adalah ${nama}, nomor telepon saya adalah ${handphone}, dan email saya ${email}. Thank You!!`);
    console.log(`Data anda telah disimpan. Terima kasih!`);

    return {nama, handphone, email};
};

const listDataJSON = async () => {
    try {
        const data = await fs.readFile(dataPath, 'utf-8');
        const contacts = JSON.parse(data);
        if (contacts.length === 0) {
            console.log("Tidak ada data tersimpan.");
        } else {
            console.log("List data (nama dan nomor telepon) :");
            contacts.forEach((contact, i) => {
                console.log(`${i + 1}. Nama: ${contact.nama}, Nomor Telp: ${contact.handphone}`);
            });
        }
    } catch (error) {
        console.error("Terjadi kesalahan saat membaca data: ", error);
    }
};

const detailDataJSON = async (nama) => {
    try {
        const data = await fs.readFile(dataPath, 'utf-8');
        const contacts = JSON.parse(data);
        const contact = contacts.find(c => c.nama === nama);
        if (contact) {
            console.log(`Daftar data kontak untuk ${contact.nama}:`);
            console.log(`- Nama: ${contact.nama}`);
            console.log(`- Nomor Telp: ${contact.handphone}`);
            if (contact.email) {
                console.log(`- Email: ${contact.email}`);
            } else {
                console.log("- Email: Tidak ada informasi email.");
            }
        } else {
            console.log(`Data dengan nama ${nama} tidak ditemukan.`);
        }
    } catch (error) {
        console.error("Terjadi kesalahan saat membaca data: ", error);
    }
};

const hapusDataDariJSON = async (nama) => {
    let existingData = null;
    let errorOccured = false;

    // Membaca data dari file
    await fs.readFile(dataPath, 'utf-8')
        .then((data) => {
            existingData = JSON.parse(data);
        })
        .catch((error) => {
            console.error("Terjadi kesalahan saat membaca data: ", error);
            errorOccured = true;
        });

    // Jika terjadi kesalahan saat membaca data, hentikan operasi
    if (errorOccured) {
        return;
    }

    // Mencari indeks kontak dengan nama yang sesuai
    const index = existingData.findIndex(contact => contact.nama === nama);

    // Menghapus data jika ditemukan, jika tidak tampilkan pesan kesalahan
    if (index !== -1) {
        existingData.splice(index, 1);

        // Menyimpan data yang telah diubah
        await fs.writeFile(dataPath, JSON.stringify(existingData, null, 2), 'utf-8')
            .then(() => {
                console.log(`Data dengan nama ${nama} telah dihapus dari contacts.json.`);
            })
            .catch((error) => {
                console.error("Terjadi kesalahan saat menyimpan data ke JSON: ", error);
            });
    } else {
        console.log(`Data dengan nama ${nama} tidak ditemukan. Tidak ada yang dihapus.`);
    }
};
module.exports = {
    tambahDataKeJSON,
    listDataJSON,
    detailDataJSON,
    hapusDataDariJSON
};
