const yargs = require('yargs');
const { tambahDataKeJSON,listDataJSON, detailDataJSON, hapusDataDariJSON } = require('./index');

yargs.command({
    command: 'add',
    describe: 'Menambahkan data kontak',
    builder: {
        nama: {
            describe: 'Nama kontak',
            demandOption: true,
            type: 'string'
        },
        handphone: {
            describe: 'Nomor handphone kontak',
            demandOption: true,
            type: 'string'
        },
        email: {
            describe: 'Alamat email kontak',
            demandOption: false,
            type: 'string'
        }
    },
    handler: (args) => {
        tambahDataKeJSON(args.nama, args.handphone, args.email)
    }
});
yargs
    .command({
        command: 'list',
        describe: 'Menampilkan list data (nama dan nomor telp) dari contacts.json',
        handler: () => {
            listDataJSON();
        }
    })
    .command({
        command: 'detail',
        describe: 'Menampilkan detail data (nama, nomor telp, dan email) berdasarkan nama',
        builder: {
            nama: {
                describe: 'Nama kontak',
                demandOption: true,
                type: 'string'
            }
        },
        handler: (args) => {
            detailDataJSON(args.nama);
        }
    })
    .command({
        command: 'delete',
        describe: 'Menghapus data berdasarkan nama',
        builder: {
            nama: {
                describe: 'Nama kontak',
                demandOption: true,
                type: 'string'
            }
        },
        handler: (args) => {
            hapusDataDariJSON(args.nama);
        }
    })
yargs.parse();
