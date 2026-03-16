export const CLOUD_NAME   = import.meta.env.VITE_CLOUDINARY_CLOUD   || 'GANTI_CLOUD_NAME'
export const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET || 'GANTI_UPLOAD_PRESET'

export async function uploadToCloudinary(file, folder = 'wedding') {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', folder)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )
  if (!res.ok) throw new Error('Upload gagal')
  const data = await res.json()
  return data.secure_url
}

export async function uploadAudioToCloudinary(file, folder = 'wedding/music') {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', folder)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
    { method: 'POST', body: formData }
  )
  if (!res.ok) throw new Error('Upload audio gagal')
  const data = await res.json()
  return data.secure_url
}
