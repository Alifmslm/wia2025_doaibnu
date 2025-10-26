import '../style/FooterAuth.css'

type FooterProps = {
    name: string;
    subname: string;
    link: string;
};

function FooterAuth({name, subname, link}:FooterProps) {
    return(
        <>
            <section className="footer_auth">
                <p>{name}</p>
                <a href={link}>{subname}</a>
            </section>
        </>
    )
}

export default FooterAuth