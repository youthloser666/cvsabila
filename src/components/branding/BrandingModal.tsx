import React, { useState } from "react";
import { Upload, Trash2, Building, PenTool } from "lucide-react";
import { useInvoiceStore } from "../../hooks/useInvoiceStore";
import { pickImageAsBase64 } from "../../services/imagePicker";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Modal } from "../ui/Modal";

interface BrandingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandingModal: React.FC<BrandingModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile, setSellerSignature } = useInvoiceStore();
  const [formData, setFormData] = useState({ ...profile });

  const handleLogoUpload = async () => {
    const base64 = await pickImageAsBase64();
    if (base64) {
      setFormData((prev) => ({ ...prev, logoDataUrl: base64 }));
    }
  };

  const handleRemoveLogo = () => {
    setFormData((prev) => ({ ...prev, logoDataUrl: "" }));
  };

  const handleSignatureUpload = async () => {
    const base64 = await pickImageAsBase64();
    if (base64) {
      setFormData((prev) => ({ ...prev, defaultSignature: base64 }));
      setSellerSignature(base64);
    }
  };

  const handleRemoveSignature = () => {
    setFormData((prev) => ({ ...prev, defaultSignature: "" }));
    setSellerSignature(null);
  };

  const handleSave = () => {
    updateProfile(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pengaturan Branding & Header Perusahaan" maxWidth="xl">
      <div className="space-y-6">
        {/* Logo Section */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-apple-ink-muted mb-2">
            Logo Perusahaan / Kop Surat
          </label>
          <div className="flex items-center gap-4 p-4 border border-apple-hairline rounded-md bg-apple-parchment/60">
            {formData.logoDataUrl ? (
              <div className="relative group bg-white p-2 rounded-sm border border-apple-hairline max-w-[200px] h-20 flex items-center justify-center">
                <img
                  src={formData.logoDataUrl}
                  alt="Company Logo"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="w-32 h-20 flex flex-col items-center justify-center border-2 border-dashed border-apple-hairline rounded-sm text-apple-ink-muted text-xs">
                <Building className="w-6 h-6 mb-1 opacity-50" />
                <span>Belum ada logo</span>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={<Upload className="w-3.5 h-3.5" />}
                onClick={handleLogoUpload}
              >
                Pilih Logo
              </Button>
              {formData.logoDataUrl && (
                <Button
                  variant="danger"
                  size="sm"
                  icon={<Trash2 className="w-3.5 h-3.5" />}
                  onClick={handleRemoveLogo}
                >
                  Hapus
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Default Seller Signature Section */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-apple-ink-muted mb-2">
            Tanda Tangan Seller Default (TTD Seller)
          </label>
          <div className="flex items-center gap-4 p-4 border border-apple-hairline rounded-md bg-apple-parchment/60">
            {formData.defaultSignature ? (
              <div className="relative group bg-white p-2 rounded-sm border border-apple-hairline max-w-[200px] h-20 flex items-center justify-center">
                <img
                  src={formData.defaultSignature}
                  alt="TTD Seller Default"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="w-32 h-20 flex flex-col items-center justify-center border-2 border-dashed border-apple-hairline rounded-sm text-apple-ink-muted text-xs">
                <PenTool className="w-6 h-6 mb-1 opacity-50" />
                <span>Belum ada TTD</span>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={<Upload className="w-3.5 h-3.5" />}
                onClick={handleSignatureUpload}
              >
                Upload TTD
              </Button>
              {formData.defaultSignature && (
                <Button
                  variant="danger"
                  size="sm"
                  icon={<Trash2 className="w-3.5 h-3.5" />}
                  onClick={handleRemoveSignature}
                >
                  Hapus
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Company Identity */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-apple-ink uppercase tracking-wider border-b border-apple-divider pb-1">
            Informasi Identitas
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Nama Perusahaan"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="Contoh: CV. SABILA MULTI KREASINDO"
            />
            <Input
              label="Tagline / Motto"
              value={formData.tagline || ""}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="Contoh: TRADE WITH ETHIC"
            />
          </div>

          <Input
            label="Alamat Utama"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Jln Soekarno Hatta No.16..."
          />

          <Input
            label="Kota / Wilayah & Kode Pos"
            value={formData.cityRegion}
            onChange={(e) => setFormData({ ...formData, cityRegion: e.target.value })}
            placeholder="Magelang, Central Java 56512 - Indonesia"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Email Resmi"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="nama@perusahaan.com"
            />
            <Input
              label="Telepon / WhatsApp"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+62 8562696881"
            />
          </div>

          <Input
            label="Penandatangan Resmi (Shipper Signer)"
            value={formData.authorizedSigner}
            onChange={(e) => setFormData({ ...formData, authorizedSigner: e.target.value })}
            placeholder="Syarif Ihsanuddin"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-apple-divider">
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Simpan Perubahan
          </Button>
        </div>
      </div>
    </Modal>
  );
};
