import request from "../utils/request.js";

export const getTravelRecommend = (data) => {
  return request.post("/recommend", data);
};

export async function fetchStream(url, data, onChunk, onComplete, onError) {
  //请求控制器
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    //发送请求
    const response = await fetch(`https://wyj-travel-assistant-sever2-262567-8-1437172584.sh.run.tcloudbase.com/api/travel/${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      signal,
    });
    // const response = await fetch(`http://localhost:80/api/travel/${url}`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(data),
    //   signal,
    // });
    //获取响应体的可读流读取器
    const reader = response.body.getReader();
    //将二进制数据解码为字符串
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter((line) => line.trim());
      for (const line of lines) {
        try {
          if (line.startsWith("data:")) {
            const jsonStr = line.substring(5);
            const jsonData = JSON.parse(jsonStr);
            if (jsonData.type === "chunk") {
              onChunk(jsonData.content);
            } else if (jsonData.done) {
              onComplete(jsonData.data);
            } else if (jsonData.error) {
              onError(jsonData.error);
            }
          }
        } catch (error) {
          onError("流式数据解析异常");
        }
      }
    }
    return controller.abort();
  } catch (error) {
    onError(error.message);
  }
}
