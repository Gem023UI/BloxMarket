const logoPath = '/BLOX.png';

export function Header() {
  return (
    <header className="bg-dark border-bottom py-3">
      <div className="container">
        <div className="d-flex align-items-center justify-content-center">
          <div className="d-flex align-items-center">
            <div className="inline-flex items-center justify-center w-24 h-20 mb-1 rounded-3xl shadow-2xl bg-white/10 backdrop-blur-md">
              <img
                src={logoPath}
                alt="BloxMarket Logo"
                className="w-auto h-20 object-cover drop-shadow-lg "
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}