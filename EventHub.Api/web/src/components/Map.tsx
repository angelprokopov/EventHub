type Props = { address: string };

export default function Map({ address }: Props) {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address
    )}`;

    return (
        <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline"
        >
            View on Google Maps
        </a>
    );
}