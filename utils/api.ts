const createURL = (path) => {
  return window.location.origin + path;
};

export const updatedEntry = async (id, content) => {
  const res = await fetch(
    new Request(createURL(`/api/journal/${id}`), {
      method: "PATCH",
      body: JSON.stringify({ content }),
    })
  );
  if (res.ok) {
    const data = await res.json();
    return data.data;
  }
};

export const createNewEntry = async () => {
  const res = await fetch(
    new Request(createURL("/api/journal"), {
      method: "POST",
    })
  );
  if (res.ok) {
    const data = await res.json();
    console.log(data);
    return data.data;
  }
};

export const askQuestions = async (question) => {
  const res = await fetch(
    new Request(createURL("/api/question"), {
      method: "POST",
      body: JSON.stringify({ question }),
    })
  );
  if (res.ok) {
    const data = await res.json();
    console.log(data);
    return data.data;
  }
};
