export default function Bio({ bio }) {
    return (
      <div className="biography">
        <h2>About Me</h2>
        <p>{bio || 'No biography available.'}</p>
      </div>
    );
  }