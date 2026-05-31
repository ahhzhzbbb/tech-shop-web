import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";

const SearchInput = () => {
  return (
    <div style={{ width: "100%", maxWidth: 500 }}>
      <Input
        placeholder="Bạn cần tìm gì?"
        suffix={
          <SearchOutlined
            style={{
              fontSize: 18,
              color: '#333',
              cursor: 'pointer'
            }}
          />
        }
        size="large"
        style={{
          borderRadius: 4,
          height: 40,
          border: 'none',
          boxShadow: 'none',
          fontSize: 14,
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        }}
      />
    </div>
  );
};

export default SearchInput;