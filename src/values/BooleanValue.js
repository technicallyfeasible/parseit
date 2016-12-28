/**
 * Boolean result wrapper
 */


const BooleanValue = function BooleanValue(value) {
  this.bool = !!value;
};
BooleanValue.prototype.valueOf = function valueOf() {
  return this.bool;
};
BooleanValue.prototype.toString = function toString() {
  return this.bool.toString();
};
BooleanValue.prototype.equals = function equals(other) {
  if (!(other instanceof BooleanValue)) {
    return false;
  }
  return this.bool === other.bool;
};

module.exports = BooleanValue;

/*
  public struct BooleanValue : IValue
  {
    /// <summary>
    /// The boolean value
    /// </summary>
    [JsonProperty("v")]
    public Boolean Bool;


    /// <summary>
    /// Generic access to the most prominent value .net type
    /// </summary>
    public Object Value
    {
      get { return Bool; }
      set { Bool = (Boolean)value; }
    }


    /// <summary>
    /// Serialize the value to binary data
    /// </summary>
    /// <returns></returns>
    public Byte[] ToBinary()
    {
      return BitConverter.GetBytes(Bool);
    }

    /// <summary>
    /// Read the value data from binary
    /// </summary>
    /// <param name="data"></param>
    public void FromBinary(Byte[] data)
    {
      Bool = BitConverter.ToBoolean(data, 0);
    }


    /// <summary>
    /// Constructor
    /// </summary>
    /// <param name="value"></param>
    public BooleanValue(Boolean value)
    {
      this.Bool = value;
    }

    public override String ToString()
    {
      return String.Format("{0}", this.Bool);
    }

    public override Boolean Equals(object obj)
    {
      if (!(obj is BooleanValue))
        return false;
      BooleanValue other = (BooleanValue)obj;
      return this.Bool.Equals(other.Bool);
    }

    public override int GetHashCode()
    {
      unchecked
      {
        return this.Bool.GetHashCode();
      }
    }

    public static bool operator ==(BooleanValue a, BooleanValue b)
    {
      return a.Bool.Equals(b.Bool);
    }

    public static bool operator !=(BooleanValue a, BooleanValue b)
    {
      return !a.Bool.Equals(b.Bool);
    }
  }
*/
