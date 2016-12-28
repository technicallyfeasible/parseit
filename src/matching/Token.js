/**
 * Token value for parsed patterns
 */


/**
 * Creates a new Token
 * @param value {string}
 * @param exactMatch {boolean}
 * @constructor
 */
const Token = function Token(value, exactMatch) {
  this.exactMatch = Boolean(exactMatch);
  if (this.exactMatch) {
    this.value = value;
    this.minCount = this.maxCount = 1;
    return;
  }

  const parts = (value || '').split(':');
  this.value = (parts.length > 0 ? parts[0] : '');
  if (parts.length === 1) {
    this.minCount = this.maxCount = 1;
  } else if (parts.length > 1) {
    switch (parts[1]) {
      case '':
        this.minCount = 1;
        this.maxCount = 1;
        break;
      case '+':
        this.minCount = 1;
        this.maxCount = this.MAX_VALUE;
        break;
      case '*':
        this.minCount = 0;
        this.maxCount = this.MAX_VALUE;
        break;
      case '?':
        this.minCount = 0;
        this.maxCount = 1;
        break;
      default: {
        const countParts = parts[1].split('-');
        if (countParts.length === 1) {
          this.minCount = this.maxCount = parseInt(countParts[0], 10);
        } else if (countParts.length >= 2) {
          this.minCount = parseInt(countParts[0] || '0', 10);
          this.maxCount = parseInt(countParts[1] || '0', 10);
        }
        break;
      }
    }
  }
  // don't allow max to be smaller than min
  if (this.maxCount < this.minCount) {
    this.maxCount = this.minCount;
  }
};
/**
 * Maximum times that a token without restriction can be repeated
 * @const
 */
Token.prototype.MAX_VALUE = 1000;

Token.prototype.equals = function equals(token) {
  if (!token) return false;
  return token.value === this.value &&
    token.minCount === this.minCount &&
    token.maxCount === this.maxCount &&
    token.exactMatch === this.exactMatch;
};
Token.prototype.toString = function toString() {
  if (this.exactMatch) {
    return this.value;
  }
  return `${this.value}:${this.minCount}-${this.maxCount}`;
};

module.exports = Token;

/*
  public class Token
  {
    public String Value;
    public Int32 MinCount;
    public Int32 MaxCount;
    public Boolean ExactMatch;

    /// <summary>
    /// Parse the token
    /// </summary>
    /// <param name="value"></param>
    /// <param name="exactMatch"></param>
    public Token(String value, Boolean exactMatch)
    {
      if (exactMatch)
      {
        this.Value = value;
        this.MinCount = this.MaxCount = 1;
        this.ExactMatch = true;
        return;
      }

#if !SCRIPTSHARP
      String[] parts = value.Split(new Char[] { ':' }, StringSplitOptions.RemoveEmptyEntries);
#else
      String[] parts = StringUtils.Split(value, ':');
#endif
      this.Value = parts[0];
      if (parts.Length == 1)
        this.MinCount = this.MaxCount = 1;
      else if (parts.Length > 1)
      {
        switch (parts[1])
        {
          case "":
            this.MinCount = 1;
            this.MaxCount = 1;
            break;
          case "+":
            this.MinCount = 1;
            this.MaxCount = Int32.MaxValue;
            break;
          case "*":
            this.MinCount = 0;
            this.MaxCount = Int32.MaxValue;
            break;
          case "?":
            this.MinCount = 0;
            this.MaxCount = 1;
            break;
          default:
            String[] countParts = parts[1].Split('-');
            if (countParts.Length == 1)
              this.MinCount = this.MaxCount = Int32.Parse(countParts[0]);
            else if (countParts.Length == 2)
            {
              this.MinCount = Int32.Parse(countParts[0]);
              this.MaxCount = Int32.Parse(countParts[1]);
            }
            break;
        }
      }
    }

#if !SCRIPTSHARP
    public override Boolean Equals(object obj)
    {
      if (ReferenceEquals(null, obj)) return false;
      if (ReferenceEquals(this, obj)) return true;
      if (obj.GetType() != GetType()) return false;
      return Equals((Token)obj);
    }

    protected bool Equals(Token other)
    {
      return string.Equals(this.Value, other.Value) && this.MinCount == other.MinCount && this.MaxCount == other.MaxCount && this.ExactMatch.Equals(other.ExactMatch);
    }

    public override int GetHashCode()
    {
      unchecked
      {
        int hashCode = (this.Value != null ? this.Value.GetHashCode() : 0);
        hashCode = (hashCode * 397) ^ this.MinCount;
        hashCode = (hashCode * 397) ^ this.MaxCount;
        hashCode = (hashCode * 397) ^ this.ExactMatch.GetHashCode();
        return hashCode;
      }
    }

    public override String ToString()
    {
      if (this.ExactMatch)
        return String.Format("{0}", this.Value);
      return String.Format("{0}:{1}-{2}", this.Value, this.MinCount, this.MaxCount);
    }
#endif
  }
*/
