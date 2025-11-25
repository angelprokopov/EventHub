type Props = {
    address: string
}

export default function Map({address}: Props) {
    const key= import.meta.env.VITE_GOOGLE_MAPS_KEY
    const encoded = encodeURIComponent(address)

    const url = `https://www.google.com/maps/embed/v1/place?key=${key}&q=${encoded}`

    return (
        <iframe
            width="100%"
            height="300"
            loading="lazy"
            style={{ border: 0, borderRadius: '12px' }}
            allowFullScreen
            src={url}
        />
    )
}