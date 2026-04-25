import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";

const SearchInput = () => {
  return (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <Input
        placeholder="Bạn cần tìm gì?"
        suffix={<SearchOutlined />}
        size="large"
        style={{
          borderRadius: 4,
          height: 42,
        }}
      />
    </div>
  );
};

export default SearchInput;