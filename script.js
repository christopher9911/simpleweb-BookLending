var dataBuku = {};
var dataBukuDipinjam = {};
var dataBukuDikembalikan = {};

function tambahBuku() {
    var namaBuku = document.getElementById("bookName").value.trim();
    var jumlahBuku = parseInt(document.getElementById("bookQuantity").value);

    if (!namaBuku || isNaN(jumlahBuku) || jumlahBuku <= 0) {
        alert("Masukkan nama buku dan jumlah yang valid.");
        return;
    }

    if (dataBuku[namaBuku]) {
        dataBuku[namaBuku] += jumlahBuku;
    } else {
        dataBuku[namaBuku] = jumlahBuku;
    }

    perbaruiDaftarBuku();
    perbaruiJumlahTotalBuku();

    // Kosongkan input untuk data buku selanjutnya
    document.getElementById("bookName").value = "";
    document.getElementById("bookQuantity").value = "";
}

function perbaruiDaftarBuku() {
    var elemenDaftarBuku = document.getElementById("bookList");
    elemenDaftarBuku.innerHTML = "";

    for (var namaBuku in dataBuku) {
        if (dataBuku[namaBuku] <= 0) {
            delete dataBuku[namaBuku];
        } else {
            let elemenDaftarBukuItem = document.createElement("li");
            elemenDaftarBukuItem.textContent = `${namaBuku} (Jumlah: ${dataBuku[namaBuku]})`;

            let tombolPinjam = document.createElement("button");
            tombolPinjam.textContent = "Pinjam";
            tombolPinjam.onclick = function () {
                pinjamBuku(namaBuku);
            };

            let tombolHapus = document.createElement("button");
            tombolHapus.textContent = "Hapus Buku";
            tombolHapus.onclick = function () {
                hapusBuku(namaBuku);
            };

            elemenDaftarBukuItem.appendChild(tombolPinjam);
            elemenDaftarBukuItem.appendChild(tombolHapus);
            elemenDaftarBuku.appendChild(elemenDaftarBukuItem);
        }
    }
}

function pinjamBuku(namaBuku) {
    var namaPeminjam = prompt("Masukkan nama peminjam:");
    var hariPinjam = parseInt(prompt("Masukkan jumlah hari peminjaman:"));

    if (!namaPeminjam || isNaN(hariPinjam) || hariPinjam <= 0) {
        alert("Input tidak valid. Silakan coba lagi.");
        return;
    }

    if (!dataBukuDipinjam[namaBuku]) {
        dataBukuDipinjam[namaBuku] = [];
    }

    dataBukuDipinjam[namaBuku].push({
        namaPeminjam: namaPeminjam,
        hariPinjam: hariPinjam
    });

    // Kurangi jumlah buku setelah dipinjam
    dataBuku[namaBuku]--;

    perbaruiDaftarBuku();
    perbaruiDaftarBukuDipinjam();
    perbaruiDaftarBukuDikembalikan();
    perbaruiJumlahTotalBuku();

    // Kosongkan input untuk peminjaman berikutnya
    document.getElementById("borrowerName").value = "";
    document.getElementById("daysToBorrow").value = "";
}

function kembalikanBuku(namaBuku) {
    if (dataBukuDipinjam[namaBuku] && dataBukuDipinjam[namaBuku].length > 0) {
        // Tambahkan jumlah buku setelah dikembalikan
        dataBuku[namaBuku]++;

        var dataBukuDikembalikanItem = dataBukuDipinjam[namaBuku].pop();
        if (!dataBukuDikembalikan[namaBuku]) {
            dataBukuDikembalikan[namaBuku] = [];
        }
        dataBukuDikembalikan[namaBuku].push(dataBukuDikembalikanItem);

        perbaruiDaftarBuku();
        perbaruiDaftarBukuDipinjam();
        perbaruiDaftarBukuDikembalikan();
        perbaruiJumlahTotalBuku();
    }
}

function hapusBuku(namaBuku) {
    if (confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
        delete dataBuku[namaBuku];
        perbaruiDaftarBuku();
        perbaruiJumlahTotalBuku();
    }
}

function perbaruiJumlahTotalBuku() {
    var jumlahTotalBuku = 0;
    for (var namaBuku in dataBuku) {
        jumlahTotalBuku += dataBuku[namaBuku];
    }

    document.getElementById("totalBookQuantity").textContent = jumlahTotalBuku;
}

function perbaruiDaftarBukuDipinjam() {
    var elemenDaftarBukuDipinjam = document.getElementById("borrowedList");
    elemenDaftarBukuDipinjam.innerHTML = "";

    for (var namaBuku in dataBukuDipinjam) {
        for (var i = 0; i < dataBukuDipinjam[namaBuku].length; i++) {
            var dataPeminjaman = dataBukuDipinjam[namaBuku][i];
            var elemenBukuDipinjam = document.createElement("li");
            elemenBukuDipinjam.textContent = `${namaBuku} (Dipinjam oleh ${dataPeminjaman.namaPeminjam} - Kembali pada ${getReturnDate(dataPeminjaman.hariPinjam)})`;

            var tombolKembalikan = document.createElement("button");
            tombolKembalikan.textContent = "Kembalikan";
            tombolKembalikan.onclick = (function (namaBuku) {
                return function () {
                    kembalikanBuku(namaBuku);
                };
            })(namaBuku);

            elemenBukuDipinjam.appendChild(tombolKembalikan);
            elemenDaftarBukuDipinjam.appendChild(elemenBukuDipinjam);
        }
    }
}

function perbaruiDaftarBukuDikembalikan() {
    var elemenDaftarBukuDikembalikan = document.getElementById("returnedList");
    elemenDaftarBukuDikembalikan.innerHTML = "";

    for (var namaBuku in dataBukuDikembalikan) {
        for (var i = 0; i < dataBukuDikembalikan[namaBuku].length; i++) {
            var dataPengembalian = dataBukuDikembalikan[namaBuku][i];
            var elemenBukuDikembalikan = document.createElement("li");
            elemenBukuDikembalikan.textContent = `${namaBuku} (Dikembalikan oleh ${dataPengembalian.namaPeminjam})`;

            elemenDaftarBukuDikembalikan.appendChild(elemenBukuDikembalikan);
        }
    }
}

function getReturnDate(hariPeminjaman) {
    var tanggalPinjam = new Date();
    var tanggalKembali = new Date(tanggalPinjam);
    tanggalKembali.setDate(tanggalKembali.getDate() + hariPeminjaman);
    return tanggalKembali.toDateString();
}

function hapusDaftarBukuDikembalikan() {
    dataBukuDikembalikan = {};
    perbaruiDaftarBukuDikembalikan();
}

// Perbarui jumlah total buku saat halaman dimuat
perbaruiJumlahTotalBuku();